import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// DynamoDB table name
const tableName = 'structured-queries-data';

export async function POST(req: any) {
  try {
    const { userId, conversationId } = await req.json();

    // Validate input
    if (!userId || !conversationId) {
      return new Response(
        JSON.stringify({ error: 'userId and conversationId are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const PK = `${userId}/queriesSessionHistory`;
    const SK = conversationId;

    const params = {
      TableName: tableName,
      Key: {
        PK,
        SK,
      },
    };

    // Delete from DynamoDB
    await dynamoDb.delete(params).promise();

    return new Response(
      JSON.stringify({ message: 'QueryConversation deleted successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
