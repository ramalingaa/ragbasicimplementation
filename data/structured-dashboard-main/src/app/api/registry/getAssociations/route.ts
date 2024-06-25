import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// DynamoDB table name for associations
const tableName = 'structured-registry-associations-v0';

export async function POST(req: any) {
  try {
    const { userId } = await req.json();
    console.log('userId: ', userId);
    const PK = `${userId}/associations`;

    const params = {
      TableName: tableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': PK,
      },
    };

    const data = await dynamoDb.query(params).promise();

    console.log('data: ', data.Items);

    return new Response(JSON.stringify({ associations: data.Items }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
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
