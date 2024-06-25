import AWS from 'aws-sdk';

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
    const { WorkspaceID, fileId, fileName } = await req.json();
    const fileKey = `${WorkspaceID}/uploadedFiles/${fileName}`;

    // Delete file from S3
    await s3
      .deleteObject({
        Bucket: bucket,
        Key: fileKey,
      })
      .promise();

    // Delete file metadata from DynamoDB
    const PK = `${WorkspaceID}/uploadedFiles`;
    const SK = fileId;

    await dynamoDb
      .delete({
        TableName: tableName,
        Key: {
          PK,
          SK,
        },
      })
      .promise();

    return new Response(
      JSON.stringify({ message: 'File and metadata deleted successfully' }),
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
