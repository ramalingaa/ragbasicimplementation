import { constructRetDatasource, getDynamoDBParams, getFileMetadata, getS3FileKey, uploadToDynamoDB, uploadToS3 } from "utils/aws_helpers";
import { v4 } from "uuid";
import Papa from 'papaparse';
import { convertStringToAlphanumericAndUnderscoresString, uploadCsvToBigQuery } from "utils/gcp_helpers";

// Import AWS SDK
const AWS = require('aws-sdk');

// Define a local function to fetch file contents from S3
async function getFileContentsFromS3(accessKeyID: string, secretAccessKey: string, bucketName: string, fileName: string, region: string) {
  try {
    // Create a new instance of the S3 service within the function scope
    const s3 = new AWS.S3({
      accessKeyId: accessKeyID,
      secretAccessKey: secretAccessKey,
      region: region
    });

    // Parameters for getObject operation
    const params = {
      Bucket: bucketName,
      Key: fileName
    };

    // Fetch file contents from S3
    const data = await s3.getObject(params).promise();

    // Return file contents
    return data.Body.toString('utf-8'); // Assuming file contents are UTF-8 encoded
  } catch (error) {
    console.error('Error fetching file contents from S3:', error);
    throw error; // Propagate error to caller
  }
}

// Write a post method to save WorkspaceID,accessKeyID,secretAccessKey,bucketName,region in the database
export async function POST(req: any) {
  try {
    const {
      WorkspaceID,
      accessKeyID,
      secretAccessKey,
      bucketName,
      fileName,
      region,
      userId,
    } = await req.json();

    // if fileName doesnt end with .csv, throw an error
    if (!fileName.endsWith('.csv')) {
      throw new Error('Only CSV files are supported');
    }
    console.log({
      WorkspaceID,
      accessKeyID,
      secretAccessKey,
      bucketName,
      fileName,
      region,
    })
    const csvData = await getFileContentsFromS3(accessKeyID, secretAccessKey, bucketName, fileName, region);
    const { data, meta } = Papa.parse(csvData, { header: true });
    const firstRow = data[0];
    
    const fileNameLocal = `${bucketName}_${fileName.split('/').pop()}`;
    const uuid = v4();
    const s3Key = getS3FileKey(WorkspaceID, fileNameLocal, uuid);
    await uploadToS3(csvData, s3Key);

    // Get file metadata
    const fileMetadata = getFileMetadata(
      WorkspaceID,
      fileNameLocal,
      Buffer.from(csvData),
      firstRow,
      'amazonS3',
    )
    console.log('fileMetadata', fileMetadata);

    // Save file metadata to DynamoDB
    const params = getDynamoDBParams(fileMetadata, WorkspaceID, uuid, userId);
    await uploadToDynamoDB(params);
    await uploadCsvToBigQuery(csvData, convertStringToAlphanumericAndUnderscoresString(WorkspaceID), convertStringToAlphanumericAndUnderscoresString(s3Key), fileMetadata.schema, false);

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
}