import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// DynamoDB table name
const tableName = 'structured-registry-connections-v0';

export async function DELETE(req: any) {
  try {
    const { userId, connectionId } = await req.json();
    const PK = `${userId}/connections`;
    const SK = connectionId;

    const params = {
      TableName: tableName,
      Key: {
        PK,
        SK,
      },
    };

    await dynamoDb.delete(params).promise();

    return new Response(
      JSON.stringify({ message: 'Connection deleted successfully' }),
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
      JSON.stringify({
        error: error.toString() || 'An unknown error occurred',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
