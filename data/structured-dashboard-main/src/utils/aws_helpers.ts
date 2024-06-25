import AWS from 'aws-sdk';
import Papa from 'papaparse';
import { DATASOURCES_DIR, ENTITY_TYPE_FILES_DIR, STRUCTURED_HARBOR_FILE_METADATA_TABLE, STRUCTURED_HARBOR_UPLOADS_V0_BUCKET, STRUCTURED_INVITATIONS_DATA_TABLE, STRUCTURED_USER_PROFILE_DATA_TABLE, STRUCTURED_WORKSPACES_TABLE } from 'utils/constants';


// Flatten nested objects
export const flattenObject = (obj: any, parentKey: string, res: any) => {
    for (let key in obj) {
        const propName = parentKey ? parentKey + '_' + key : key;
        if (typeof obj[key] === 'object') {
            flattenObject(obj[key], propName, res);
        } else {
            res[propName] = obj[key];
        }
    }
    return res;
};

export function convertObjectToCSV(objArray: any) {

    const flatObjectsArray = objArray.map((obj: any) => flattenObject(obj, '', {}));

    // Convert to CSV with PapaParse
    const csv = Papa.unparse(flatObjectsArray);

    // Convert CSV string to Buffer (for Node.js)
    const buffer = Buffer.from(csv, 'utf-8');

    return buffer;
}

// Configure AWS SDK
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const tableName = 'structured-harbor-file-metadata';
const bucket = 'structured-harbor-uploads-v0';
const s3 = new AWS.S3();
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const salt = `/`

export function getFileMetadata(
    userId: string,
    fileName: string,
    csvBuffer: Buffer,
    firstRow: any,
    source: string,
) {
    return {
        fileName: fileName,
        fileId: `${userId}/uploadedFiles/${fileName}`,
        userId: userId,
        size: csvBuffer.byteLength,
        schema: Object.keys(firstRow).map((columnName) => {
            let columnType = 'string';  // Default to string
            const value: any = firstRow[columnName];

            if (value === null || value === undefined) {
                columnType = 'string';
            } else if (typeof value === 'boolean') {
                columnType = 'bool';
            } else if (typeof value === 'number') {
                columnType = !isNaN(parseFloat(value.toString())) && isFinite(value) ? 'number' : 'string';
            } else if (typeof value === 'string') {
                if (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)) {
                    columnType = 'datetime';
                }
            } else if (Array.isArray(value)) {
                columnType = 'list';
            }

            return { columnName, columnType };
        }),
        uploadTime: new Date().toISOString(),
        version: 1,
        source: source,
    };
}

export function getDynamoDBParams(
    fileMetadata: any,
    workspaceID: string,
    uuid: string,
    userId: string,
    params?: any,
    useCustomParams?: boolean,
    fileName?: string,
    size?: number,
    schema?: any,
    uploadTime?: string,
    version?: number,
) {
    if (useCustomParams) {
        return {
            TableName: tableName,
            Item: {
                PK: getPK(workspaceID),
                SK: getSK(fileName, uuid),
                userId: workspaceID,
                uploaderId: userId,
                fileName: fileName,
                fileUUID: uuid,
                fileKey: getSK(fileName, uuid),
                fullFileKey: getFullFileKey(bucket, workspaceID, fileName, uuid),
                size: size,
                uploadTime: uploadTime,
                version: version,
                schema: schema,
                source: fileMetadata.source,
                params: params || {},
            },
        };
    }
    return {
        TableName: tableName,
        Item: {
            PK: getPK(workspaceID),
            SK: getSK(fileMetadata.fileName, uuid),
            userId: workspaceID,
            uploaderId: userId,
            fileName: fileMetadata.fileName,
            fileUUID: uuid,
            fileKey: getSK(fileMetadata.fileName, uuid),
            fullFileKey: getFullFileKey(bucket, workspaceID, fileMetadata.fileName, uuid),
            size: fileMetadata.size,
            uploadTime: fileMetadata.uploadTime,
            version: fileMetadata.version,
            schema: fileMetadata.schema,
            source: fileMetadata.source,
            params: params || {},
        },
    };
}

export function getDatasourceId(
    workspaceId: string,
    fileName: string,
    uuid: string,
) {
    return `${workspaceId}/${DATASOURCES_DIR}/${fileName}/${uuid};`;
}

export function getFullFileKey(
    bucketName: string,
    userId: string,
    fileName: string,
    uuid: string,
) {
    return `${bucketName}/${userId}/uploadedFiles/${fileName}/${uuid}`
}

export async function constructRetDatasource(fileMetadata: any, uuid?: string, userId?: string, workspaceId?: string) {
    fileMetadata.uploaderEmail = await getUserEmail(userId);
    return {
        id: getDatasourceId(workspaceId, fileMetadata.fileName, uuid),
        type: 'csv',
        name: fileMetadata.fileName,
        fileMetadata: fileMetadata,
        uuid: uuid,
        uploaderEmail: fileMetadata.uploaderEmail,
    };
}

export async function uploadToS3(
    csvBuffer: Buffer,
    fileKey: string,
) {
    return await s3.upload({
        Bucket: bucket,
        Key: fileKey,
        Body: csvBuffer,
        ContentType: 'text/csv',
    }).promise();
}

export function getS3FileKey(
    userId: string,
    fileName: string,
    uuid: string,
    s3Dir: string = DATASOURCES_DIR,
) {
    return `${userId}/${s3Dir}/${fileName}/${uuid};`;
}

export async function uploadToDynamoDB(
    dynamoDbParams: any,
) {
    return await dynamoDb.put(dynamoDbParams).promise();
}

export function getPK(
    userId: string,
) {
    return `${userId}`;
}

export function getSK(
    fileName: string,
    uuid: string,
) {
    return `${fileName}${salt}${uuid}`;
}

export function getDefaultWorkspaceKey(userId: string) {
    return `${userId}-default-workspace`;
}

// Utility function to get workspace details
export async function getWorkspaceDetails(workspaceId: string) {
    const params = {
        TableName: STRUCTURED_WORKSPACES_TABLE,
        Key: { WorkspaceID: workspaceId },
    };
    return await dynamoDb.get(params).promise();
}

// Utility function to delete workspace entry from the table
export async function deleteWorkspaceEntry(workspaceId: string) {
    const params = {
        TableName: STRUCTURED_WORKSPACES_TABLE,
        Key: { WorkspaceID: workspaceId },
    };
    await dynamoDb.delete(params).promise();
    console.log("1. Workspace deleted");
}

export async function removeWorkspaceFromUserProfile(workspaceId: string, userId: string) {
    const userParams = {
        TableName: STRUCTURED_USER_PROFILE_DATA_TABLE,
        Key: { userId: userId },
    };
    const data = await dynamoDb.get(userParams).promise();
    const workspaceIds = data.Item.WorkspaceIDs;
    const workspaceIdIndex = workspaceIds.indexOf(workspaceId);
    if (workspaceIdIndex > -1) {
        workspaceIds.splice(workspaceIdIndex, 1);
    }
    const updateParams = {
        TableName: STRUCTURED_USER_PROFILE_DATA_TABLE,
        Key: { userId: userId },
        UpdateExpression: 'SET WorkspaceIDs = :workspaceIds',
        ExpressionAttributeValues: { ':workspaceIds': workspaceIds },
    };
    await dynamoDb.update(updateParams).promise();
    console.log("2. Workspace removed from user profile");
}

// Utility function to remove workspaceId from user profile
export async function removeWorkspaceFromUserProfiles(workspaceId: string, members: any[]) {
    for (const member of members) {
        await removeWorkspaceFromUserProfile(workspaceId, member.userId);
    }
}

// Utility function to delete all files in the workspace
export async function deleteWorkspaceFiles(workspaceId: string, dir: string = DATASOURCES_DIR) {
    const listParams = {
        Bucket: STRUCTURED_HARBOR_UPLOADS_V0_BUCKET,
        Prefix: `${workspaceId}/${dir}`,
    };
    const s3Objects = await s3.listObjectsV2(listParams).promise();
    if (s3Objects.Contents.length) {
        const keys = s3Objects.Contents.map(({ Key }) => ({ Key }));
        const deleteParams = {
            Bucket: STRUCTURED_HARBOR_UPLOADS_V0_BUCKET,
            Delete: { Objects: keys },
        };
        await s3.deleteObjects(deleteParams).promise();
        console.log("3. All files in workspace deleted");
    } else {
        console.log("3. No files to delete");
    }
}

// Utility function to delete all invitations to the workspace
export async function deleteWorkspaceInvitations(workspaceId: string) {
    const params = {
        TableName: STRUCTURED_INVITATIONS_DATA_TABLE,
        FilterExpression: 'WorkspaceID = :workspaceId',
        ExpressionAttributeValues: { ':workspaceId': workspaceId },
    };
    const data = await dynamoDb.scan(params).promise();
    const deleteInvitations = data.Items.map(({ InvitationID }) => {
        const deleteParams = {
            TableName: STRUCTURED_INVITATIONS_DATA_TABLE,
            Key: { InvitationID },
        };
        return dynamoDb.delete(deleteParams).promise();
    });
    await Promise.all(deleteInvitations);
    console.log("4. All invitations to workspace deleted");
}

// Utility function to delete all workspace related datasources
export async function deleteWorkspaceDatasources(workspaceId: string) {
    const params = {
        TableName: STRUCTURED_HARBOR_FILE_METADATA_TABLE,
        FilterExpression: 'PK = :workspaceId',
        ExpressionAttributeValues: { ':workspaceId': workspaceId },
    };
    const data = await dynamoDb.scan(params).promise();
    const deleteDatasources = data.Items.map(({ SK }) => {
        const deleteParams = {
            TableName: STRUCTURED_HARBOR_FILE_METADATA_TABLE,
            Key: { PK: workspaceId, SK },
        };
        return dynamoDb.delete(deleteParams).promise();
    });
    await Promise.all(deleteDatasources);
    console.log("5. All datasources deleted");
}

export async function removeWorkspaceMember(workspaceId: string, workspaceMembers: any[], userId: string) {
    const workspaceMemberIndex = workspaceMembers.findIndex((member) => member.userId === userId);
    if (workspaceMemberIndex > -1) {
        workspaceMembers.splice(workspaceMemberIndex, 1);
    }
    const updateParams = {
        TableName: STRUCTURED_WORKSPACES_TABLE,
        Key: { WorkspaceID: workspaceId },
        UpdateExpression: 'SET Members = :members',
        ExpressionAttributeValues: { ':members': workspaceMembers },
    };
    await dynamoDb.update(updateParams).promise();
    console.log("6. Workspace member removed");
}

export async function updateUserProfileInfo(
    userId: string,
    email: string,
    phoneNumber: string,
    name: string,
    company: string,
    techStack: string,
) {
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: STRUCTURED_USER_PROFILE_DATA_TABLE,
        Key: {
            userId,
        },
        UpdateExpression:
            'set email = :e, phoneNumber = :p, #nm = :n, company = :c, techStack = :t',
        ExpressionAttributeValues: {
            ':e': email || '',
            ':p': phoneNumber || '',
            ':n': name || '',
            ':c': company || '',
            ':t': techStack || '',
        },
        ExpressionAttributeNames: {
            '#nm': 'name',
        },
        ReturnValues: 'UPDATED_NEW',
    };

    await dynamoDb.update(params).promise();
    console.log("7. User profile updated");
}

export async function updateUserEmail(
    userId: string,
    email: string,
) {
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: STRUCTURED_USER_PROFILE_DATA_TABLE,
        Key: {
            userId,
        },
        UpdateExpression: 'set email = :e',
        ExpressionAttributeValues: {
            ':e': email || '',
        },
        ReturnValues: 'UPDATED_NEW',
    };

    await dynamoDb.update(params).promise();
    console.log("8. User email updated");
}

export async function deleteInvitation(invitationId: string) {
    const params = {
        TableName: STRUCTURED_INVITATIONS_DATA_TABLE,
        Key: { InvitationID: invitationId },
    };
    await dynamoDb.delete(params).promise();
    console.log("9. Invitation deleted");
}

export async function updateLLMModel(userId: string, llmModel: string) {
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: STRUCTURED_USER_PROFILE_DATA_TABLE,
        Key: {
            userId,
        },
        UpdateExpression: 'set llmModel = :l',
        ExpressionAttributeValues: {
            ':l': llmModel || '',
        },
        ReturnValues: 'UPDATED_NEW',
    };

    await dynamoDb.update(params).promise();
    console.log('LLM model updated');
}

export function getSKFromDatasourceId(datasourceId: string) {
    const parts: string[] = datasourceId.split('/');

    const filename: string = parts[parts.length - 2];

    const uuidWithSemicolon: string = parts[parts.length - 1];
    const uuid: string = uuidWithSemicolon.slice(0, -1);

    console.log("Filename:", filename);
    console.log("UUID:", uuid);
    return getSK(filename, uuid);
}

export async function updateDatasourceDescription(
    WorkspaceId: string,
    datasourceId: string,
    description: string
) {
    try {
        const updateParams = {
            TableName: STRUCTURED_HARBOR_FILE_METADATA_TABLE,
            Key: { PK: getPK(WorkspaceId), SK: getSKFromDatasourceId(datasourceId) },
            UpdateExpression: 'SET description = :description',
            ExpressionAttributeValues: { ':description': description },
        };
        await dynamoDb.update(updateParams).promise();
        return true;
    } catch (error) {
        throw error;
    }
}

export async function saveDescriptionForColumnInSchemaHelper(
    WorkspaceId: string,
    datasourceId: string,
    columnName: string,
    description: string
) {
    try {
        const getSchemaParams = {
            TableName: STRUCTURED_HARBOR_FILE_METADATA_TABLE,
            Key: { PK: getPK(WorkspaceId), SK: getSKFromDatasourceId(datasourceId) },
        };
        const data = await dynamoDb.get(getSchemaParams).promise();
        const schema = data.Item.schema;
        const index = schema.findIndex((column: any) => column.columnName === columnName);
        schema[index].description = description;
        const updateSchemaParams = {
            TableName: STRUCTURED_HARBOR_FILE_METADATA_TABLE,
            Key: { PK: getPK(WorkspaceId), SK: getSKFromDatasourceId(datasourceId) },
            UpdateExpression: 'SET #schemaAlias = :schemaValue',
            ExpressionAttributeNames: { '#schemaAlias': 'schema' },
            ExpressionAttributeValues: { ':schemaValue': schema },
        };
        await dynamoDb.update(updateSchemaParams).promise();
        return true;
    } catch (error) {
        throw error;
    }
}

export async function getUserEmail(userId: string) {
    if (!userId || userId === 'undefined' || userId === 'null') {
        return '';
    }
    const params = {
        TableName: STRUCTURED_USER_PROFILE_DATA_TABLE,
        Key: { userId },
    };
    const data = await dynamoDb.get(params).promise();
    const email = data.Item.email || '';
    // console.log("Email:", email);
    return email;
}

export async function updateEntityTypesInWorkspace(
    workspaceId: string,
    entityTypes: any,
) {
    const params = {
        TableName: STRUCTURED_WORKSPACES_TABLE,
        Key: { WorkspaceID: workspaceId },
        UpdateExpression: 'SET entityTypes = :entityTypes',
        ExpressionAttributeValues: { ':entityTypes': entityTypes },
    };
    await dynamoDb.update(params).promise();
}

// Define the type for the input object where all values are expected to be strings.
interface OriginalObject {
    [key: string]: string;
}

// Define the type for the returned object where all values can be string or null.
interface ConvertedObject {
    [key: string]: string | null;
}

export function formatEntityTypePropertiesObj(originalObject: OriginalObject): ConvertedObject {
    // Function to extract the file name from the path
    const extractFileName = (path: string): string | null => {
        // Extract the file name before the first slash after "uploadedFiles/"
        const match = /uploadedFiles\/([^\/]+)\//.exec(path);
        return match ? match[1] : null;
    };

    const convertedObject: ConvertedObject = {};
    Object.keys(originalObject).forEach((key: string) => {
        if (typeof (originalObject[key]) == 'string') {
            convertedObject[key] = extractFileName(originalObject[key]);
        } else {
            let filenames = ""
            for (let i = 0; i < originalObject[key].length; i++) {
                filenames += "     " + extractFileName(originalObject[key][i]);
            }
            convertedObject[key] = filenames
        }
    });
    return convertedObject;
}

export async function getFilesFromS3(workspaceId: string) {
    const prefix = `${workspaceId}/${ENTITY_TYPE_FILES_DIR}/`;

    const listParams = {
        Bucket: bucket,
        Prefix: prefix,
    };

    const filesData = await s3.listObjectsV2(listParams).promise();
    console.log('filesData: ', filesData)
    const files = await Promise.all(
        (filesData.Contents || []).map(async (file) => {
            const fileId = file.Key!.split('/').pop()!;
            // file.Key = auth0|65e9b8f3b8e37ba0562b6e83/uploadedFiles/line_items_hubspot.csv/ca6fb19c-96f4-4229-9d27-fa508e5ac9cc;
            // fileName = line_items_hubspot.csv
            const [WorkspaceIDTemp, temp, fileName, uuid] = file.Key.slice(0, -1).split('/');
            const metadataParams = {
                TableName: tableName,
                Key: {
                    PK: getPK(workspaceId),
                    SK: getSK(fileName, uuid),
                },
            };

            const fileMetadataResult = await dynamoDb.get(metadataParams).promise();
            const fileMetadata = fileMetadataResult.Item;

            const fileKey = getS3FileKey(
                workspaceId,
                fileName,
                uuid,
                ENTITY_TYPE_FILES_DIR,
            );

            const s3Params = {
                Bucket: bucket,
                Key: fileKey,
            };

            // Promise wrapper for getObject to use with async/await
            const getFilePromise = () =>
                new Promise((resolve, reject) => {
                    s3.getObject(s3Params, (err, data) => {
                        if (err) return reject(err);
                        resolve(data.Body as Buffer);
                    });
                });
            const fileContents = await getFilePromise();
            return {
                fileKey,
                fileName,
                fileContents,
            }
        }),
    );
    return files;
}

export function generateRandomString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export async function saveWorkspaceDBDetails(
    workspaceId: string,
    host: string,
    port: number,
    instanceIdentifier: string,
    masterUserName: string,
    masterPassword: string,
) {
    const params = {
        TableName: STRUCTURED_WORKSPACES_TABLE,
        Key: { WorkspaceID: workspaceId },
        UpdateExpression: 'SET #dbDetails = :dbDetails',
        ExpressionAttributeNames: { '#dbDetails': 'dbDetails' },
        ExpressionAttributeValues: {
            ':dbDetails': {
                host,
                port,
                instanceIdentifier,
                masterUserName,
                masterPassword,
            },
        },
    };
    await dynamoDb.update(params).promise();
}

export async function clearWorkspaceDBDetails(workspaceId: string) {
    try {
        const params = {
            TableName: STRUCTURED_WORKSPACES_TABLE,
            Key: { WorkspaceID: workspaceId },
            UpdateExpression: 'REMOVE #dbDetails',
            ExpressionAttributeNames: { '#dbDetails': 'dbDetails' },
        };
        await dynamoDb.update(params).promise();
    } catch (error) {
        console.error('Error clearing workspace DB details:', error);
    }
}