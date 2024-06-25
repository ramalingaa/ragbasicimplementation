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

export async function POST(req: any) {
  try {
    const { userId, connection } = await req.json();
    const PK = `${userId}/connections`;
    const SK = connection.id;

    const params = {
      TableName: tableName,
      Item: {
        PK,
        SK,
        ...connection,
      },
    };

    await dynamoDb.put(params).promise();

    return new Response(
      JSON.stringify({ message: 'Connection saved successfully' }),
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
