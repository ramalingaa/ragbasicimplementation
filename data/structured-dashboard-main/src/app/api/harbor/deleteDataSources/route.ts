import AWS from 'aws-sdk';
import { getPK, getS3FileKey, getSK } from 'utils/aws_helpers';
import { convertStringToAlphanumericAndUnderscoresString } from 'utils/formatters';
import { deleteTableFromDataset } from 'utils/gcp_helpers';

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
  const { WorkspaceID, files } = await req.json();

  if (!WorkspaceID) {
    throw new Error('User ID is required');
  }

  if (!Array.isArray(files) || files.length === 0) {
    throw new Error('A list of file names is required');
  }

  try {
    // Delete each file from the S3 bucket
    const deleteS3Promises = files.map((file) => {
      const deleteParams = {
        Bucket: bucket,
        Key: getS3FileKey(
          WorkspaceID,
          file.fileName,
          file.uuid,
        ),
      };
      return s3.deleteObject(deleteParams).promise();
    });

    // Delete each file's metadata from DynamoDB
    const deleteMetadataPromises = files.map((file) => {
      const deleteMetadataParams = {
        TableName: tableName,
        Key: {
          PK: getPK(WorkspaceID),
          SK: getSK(file.fileName, file.uuid),
        },
      };
      return dynamoDb.delete(deleteMetadataParams).promise();
    });

    const deleteBigQueryTablesPromises = files.map((file) => {
      return deleteTableFromDataset(
        convertStringToAlphanumericAndUnderscoresString(WorkspaceID),
        convertStringToAlphanumericAndUnderscoresString(getS3FileKey(WorkspaceID, file.fileName, file.uuid)),
      );
    });

    // Use Promise.all to wait for all deletions to complete
    await Promise.all(deleteS3Promises);
    await Promise.all(deleteMetadataPromises);
    await Promise.all(deleteBigQueryTablesPromises);

    return new Response(
      JSON.stringify({
        message: 'Selected Datasources deleted successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Deletion error: ', error);
    return new Response(
      JSON.stringify({ error: error || 'Error deleting files and metadata' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
