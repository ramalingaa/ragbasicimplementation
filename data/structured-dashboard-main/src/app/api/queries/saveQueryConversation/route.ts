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

async function checkForExistingConversation(userId: string, conversationId: string) {
  const params = {
    TableName: tableName,
    Key: {
      PK: userId,
      SK: conversationId,
    },
  };

  const existingConversation = await dynamoDb.get(params).promise();
  console.log("existingConversation", existingConversation.Item)
  return existingConversation.Item;
}

export async function POST(req: any) {
  try {
    const { userId, queryConversation } = await req.json();

    // Validate input
    if (!userId || !queryConversation) {
      return new Response(
        JSON.stringify({
          error: 'userId and queryConversation are required',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const PK = `${userId}/queriesSessionHistory`;
    const SK = queryConversation.id;

    console.log({ PK, SK })
    if (await checkForExistingConversation(PK, SK)) {
      // update existing conversation
      const params = {
        TableName: tableName,
        Key: {
          PK,
          SK,
        },
        UpdateExpression: 'set queryConversation = :qc',
        ExpressionAttributeValues: {
          ':qc': queryConversation,
        },
      };
      await dynamoDb.update(params).promise();
    } else {
      const params = {
        TableName: tableName,
        Item: {
          PK,
          SK,
          queryConversation,
        },
      };

      await dynamoDb.put(params).promise();
    }

    return new Response(
      JSON.stringify({
        message: 'QueryConversation saved successfully',
      }),
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
