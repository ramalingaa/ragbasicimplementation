import AWS from 'aws-sdk';

// AWS SDK configuration
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// DynamoDB table name
const tableName = 'structured-user-profile-data';

export async function POST(req: any) {
  try {
    const { userId } = await req.json();

    console.log('userId', userId);

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: 'userId is required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
      TableName: tableName,
      Key: {
        userId,
      },
    };

    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      return new Response(
        JSON.stringify({
          message: 'User profile information not yet saved.',
          data: {},
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    return new Response(
      JSON.stringify({
        message: 'User profile information retrieved successfully',
        data: result.Item,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error retrieving user profile information:', error);
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
