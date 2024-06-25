import AWS from 'aws-sdk';
import { getPK } from 'utils/aws_helpers';

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// S3 bucket name
const bucket = 'structured-harbor-uploads-v0';

// DynamoDB table name
const tableName = 'structured-harbor-file-metadata';

export async function DELETE(req: any) {
  try {
    const { WorkspaceID } = await req.json();

    // List all files in the user's directory in S3
    const listParams = {
      Bucket: bucket,
      Prefix: `${WorkspaceID}/uploadedFiles/`,
    };
    const listedObjects = await s3.listObjectsV2(listParams).promise();

    // Delete all files from S3
    if (listedObjects.Contents && listedObjects.Contents.length > 0) {
      const deleteParams = {
        Bucket: bucket,
        Delete: {
          Objects: listedObjects.Contents.map((obj) => ({ Key: obj.Key })),
        },
      };
      await s3.deleteObjects(deleteParams).promise();
    }

    // Delete all file metadata from DynamoDB for the user
    const queryParams = {
      TableName: tableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': getPK(WorkspaceID),
      },
    };
    const queryResult = await dynamoDb.query(queryParams).promise();

    if (queryResult.Items && queryResult.Items.length > 0) {
      const batchWriteParams = {
        RequestItems: {
          [tableName]: queryResult.Items.map((item) => ({
            DeleteRequest: {
              Key: {
                PK: item.PK,
                SK: item.SK,
              },
            },
          })),
        },
      };
      await dynamoDb.batchWrite(batchWriteParams).promise();
    }

    return new Response(
      JSON.stringify({
        message: 'All files and metadata deleted successfully for the user',
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
