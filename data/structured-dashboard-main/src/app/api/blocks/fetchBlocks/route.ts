import AWS from 'aws-sdk';

// AWS SDK configuration
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// DynamoDB table name
const tableName = 'structured-blocks-data';

export async function POST(req: any) {
  try {
    const { WorkspaceID } = await req.json();

    console.log('WorkspaceID', WorkspaceID);

    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName: tableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `${WorkspaceID}/blocks`,
      },
    };

    const data = await dynamoDb.query(params).promise();

    console.log('data', data);

    return new Response(
      JSON.stringify({
        message: 'Blocks fetched successfully',
        data: data.Items,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching blocks:', error);
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
