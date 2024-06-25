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

    // Fetch all items from DynamoDB with the specified PK
    const params = {
      TableName: tableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': PK,
      },
    };

    const result = await dynamoDb.query(params).promise();
    const items = result.Items;

    // Delete each item individually
    for (const item of items) {
      const deleteParams = {
        TableName: tableName,
        Key: {
          PK: item.PK,
          SK: item.SK,
        },
      };

      await dynamoDb.delete(deleteParams).promise();
    }

    return new Response(
      JSON.stringify({ message: 'Items deleted successfully' }),
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
