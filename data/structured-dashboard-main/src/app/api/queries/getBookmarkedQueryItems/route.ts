import AWS from 'aws-sdk';

// AWS SDK configuration
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// DynamoDB table name
const tableName = 'structured-bookmarked-queries-data';

export async function POST(req: any) {
  try {
    const { WorkspaceID } = await req.json();
    console.log('Workspace ID:', WorkspaceID);

    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: tableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `${WorkspaceID}/bookmarks`,
      },
    };

    const result = await dynamoDb.query(params).promise();
    const bookmarkedQueryItems = result.Items;

    return new Response(
      JSON.stringify({
        bookmarkedQueryItems,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.log('Error fetching bookmarked query items:', error);
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
