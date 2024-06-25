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
    const { blockId, WorkspaceID } = await req.json();

    const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: tableName,
      Key: {
        PK: `${WorkspaceID}/blocks`,
        SK: blockId,
      },
    };

    await dynamoDb.delete(params).promise();

    return new Response(
      JSON.stringify({
        message: 'Block deleted successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.log('Error deleting block:', error);
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
