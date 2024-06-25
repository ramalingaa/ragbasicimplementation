import { v4 } from "uuid";
import { constructRetDatasource, getDynamoDBParams, getFileMetadata, getS3FileKey, getWorkspaceDetails, uploadToDynamoDB, uploadToS3 } from "utils/aws_helpers";
import Papa from 'papaparse';
import {convertStringToAlphanumericAndUnderscoresString, uploadCsvToBigQuery} from "utils/gcp_helpers";

// Define the POST handler for the file upload
export const POST = async (req: any, res: any) => {
    try {
        // Parse the incoming form data
        const formData = await req.formData();

        // Get the file from the form data
        const file = formData.get("file");
        const WorkspaceID = formData.get("WorkspaceID");
        const userId = formData.get("userId");

        if (!file) {
            throw new Error("No file received");
        }

        // Ensure file.arrayBuffer() provides data before converting it to Buffer
        const arrayBuffer = await file.arrayBuffer();
        if (!arrayBuffer) {
            throw new Error("Failed to read file data");
        }
        const csvBuffer = Buffer.from(arrayBuffer);
        const fileName = convertStringToAlphanumericAndUnderscoresString(file.name);
        const uuid = v4();

        // Promise wrapper for getSignedUrl to use with async/await
        const s3Key = getS3FileKey(WorkspaceID, fileName, uuid)
        await uploadToS3(csvBuffer, s3Key);
        const { data, meta } = Papa.parse(csvBuffer.toString("utf-8"), { header: true });
        const firstRow = data[0];
        const fileMetadata = getFileMetadata(
            WorkspaceID,
            fileName,
            csvBuffer,
            firstRow,
            'csv',
        );

        // Upload filemetadata to dynamodb
        const dynamoDbParams = getDynamoDBParams(fileMetadata, WorkspaceID, uuid, userId);
        await uploadToDynamoDB(dynamoDbParams);
        
        // const workspaceDetails = await getWorkspaceDetails(WorkspaceID);
        await uploadCsvToBigQuery(csvBuffer, convertStringToAlphanumericAndUnderscoresString(WorkspaceID), convertStringToAlphanumericAndUnderscoresString(s3Key), fileMetadata.schema, false);

        const dataSource = await constructRetDatasource(fileMetadata, uuid, userId, WorkspaceID);

        return new Response(
            JSON.stringify({
                dataSource,
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
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
};