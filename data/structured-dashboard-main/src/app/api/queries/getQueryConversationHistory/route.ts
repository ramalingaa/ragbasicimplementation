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
    const { WorkspaceID } = await req.json();

    // Validate input
    if (!WorkspaceID) {
      return new Response(JSON.stringify({ error: 'WorkspaceID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const PK = `${WorkspaceID}/queriesSessionHistory`;
    const params = {
      TableName: tableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': PK,
      },
    };

    // Fetch from DynamoDB
    const result = await dynamoDb.query(params).promise();
    const queryConversationHistory = result.Items;

    // Extract queryConversation from each item
    const modifiedItems = queryConversationHistory.map(
      (item) => item.queryConversation,
    );

    return new Response(
      JSON.stringify({
        queryConversationHistory: modifiedItems,
      }),
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
