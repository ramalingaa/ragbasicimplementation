import AWS from 'aws-sdk';
import { QueryConversationItem } from 'zustand/queries/queriesStore';

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// DynamoDB table name
const tableName = 'structured-queries-data';

async function getExistingConversation(userId: string, conversationId: string) {
  const params = {
    TableName: tableName,
    Key: {
      PK: userId,
      SK: conversationId,
    },
  };
  const existingConversation = await dynamoDb.get(params).promise();
  return existingConversation.Item;
}

export async function POST(req: any) {
  try {
    const { userId, queryConversation, updatedItem } = await req.json();

    // Validate input
    if (!userId || !queryConversation || !updatedItem) {
      const errorResponse = {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'userId, queryConversation, and updatedItem are required',
        }),
      };
      console.log('Validation error:', errorResponse);
      return new Response(errorResponse.body, {
        status: errorResponse.status,
        headers: errorResponse.headers,
      });
    }

    const PK = `${userId}/queriesSessionHistory`;
    const SK = queryConversation.id;

    const existingConversation = await getExistingConversation(PK, SK);

    if (existingConversation) {
      // Update the specific item in the items array
      const updatedItems = existingConversation.queryConversation.items.map(
        (item: QueryConversationItem) => {
          if (item.id === updatedItem.id) {
            return updatedItem;
          }
          return item;
        },
      );

      console.log('__________________________________');

      console.log('updatedItem.bookmarked', updatedItem.bookmarked);

      console.log('updatedItem', updatedItem);

      console.log('queryConversation', queryConversation);

      console.log('Updated items:', updatedItems);

      console.log(
        'Existing conversation queryConversation:',
        existingConversation.queryConversation,
      );

      const params = {
        TableName: tableName,
        Key: {
          PK,
          SK,
        },
        UpdateExpression: 'set #qc.#items = :items',
        ExpressionAttributeNames: {
          '#qc': 'queryConversation',
          '#items': 'items',
        },
        ExpressionAttributeValues: {
          ':items': updatedItems,
        },
      };

      console.log('Update params:', params);

      await dynamoDb.update(params).promise();

      const successResponse = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'QueryConversation item updated successfully',
        }),
      };
      console.log('Success response:', successResponse);
      console.log('__________________________________');

      return new Response(successResponse.body, {
        status: successResponse.status,
        headers: successResponse.headers,
      });
    } else {
      const notFoundResponse = {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Conversation not found' }),
      };
      console.log('Conversation not found:', notFoundResponse);
      return new Response(notFoundResponse.body, {
        status: notFoundResponse.status,
        headers: notFoundResponse.headers,
      });
    }
  } catch (error) {
    console.error('Error updating QueryConversation item:', error);
    const errorResponse = {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.toString() || 'An unknown error occurred',
      }),
    };
    console.log('Error response:', errorResponse);
    return new Response(errorResponse.body, {
      status: errorResponse.status,
      headers: errorResponse.headers,
    });
  }
}
