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
    const { WorkspaceID, block } = await req.json();

    console.log('WorkspaceID:', WorkspaceID);
    console.log('Saving block:', block);

    const blockId = block.id || `${Date.now()}`;

    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: tableName,
      Item: {
        PK: `${WorkspaceID}/blocks`,
        SK: blockId,
        ...block,
      },
    };

    await dynamoDb.put(params).promise();

    return new Response(
      JSON.stringify({
        message: 'Block saved successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.log('Error saving block:', error);
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
