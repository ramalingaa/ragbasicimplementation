import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// DynamoDB table name
const tableName = 'structured-harbor-file-metadata';

export async function POST(req: any) {
  try {
    const { filename, userId, size, schema, uploadTime, version, fileId } =
      await req.json();
    const PK = `${userId}/uploadedFiles`;
    const SK = fileId;

    const params = {
      TableName: tableName,
      Item: {
        PK,
        SK,
        filename,
        userId,
        size,
        schema,
        uploadTime,
        version,
      },
    };

    await dynamoDb.put(params).promise();

    return new Response(
      JSON.stringify({ message: 'File metadata saved successfully' }),
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
