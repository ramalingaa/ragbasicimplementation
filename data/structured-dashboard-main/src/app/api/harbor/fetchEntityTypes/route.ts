import AWS from 'aws-sdk';
import { getPK, getSK, getUserEmail } from 'utils/aws_helpers';
import { ENTITY_TYPE_FILES_DIR } from 'utils/constants';

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const bucket = 'structured-harbor-uploads-v0';
const tableName = 'structured-harbor-file-metadata';

export async function POST(req: any) {
  try {
    const { WorkspaceID } = await req.json();
    if (!WorkspaceID) {
      throw new Error('User ID is required');
    }
    const prefix = `${WorkspaceID}/${ENTITY_TYPE_FILES_DIR}/`;

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
            PK: getPK(WorkspaceID),
            SK: getSK(fileName, uuid),
          },
        };

        const fileMetadataResult = await dynamoDb.get(metadataParams).promise();
        const fileMetadata = fileMetadataResult.Item;

        // get uploaderId from fileMetadata
        const uploaderId = fileMetadata?.uploaderId || '';
        const uploaderEmail = await getUserEmail(uploaderId);
        return {
          id: file.Key!,
          name: fileName,
          uploaderEmail: uploaderEmail,
          uuid: uuid,
          type: 'csv',
          fileMetadata,
        };
      }),
    );

    return new Response(JSON.stringify(files), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('error: ', error);
    return new Response(
      JSON.stringify({ error: error || 'An unknown error occurred' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
