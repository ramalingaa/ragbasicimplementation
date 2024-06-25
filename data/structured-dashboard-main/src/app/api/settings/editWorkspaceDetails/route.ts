import AWS from 'aws-sdk';
import { STRUCTURED_WORKSPACES_TABLE } from 'utils/constants';

// AWS SDK configuration
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const updateWorkspaceDetails = async (
  workspaceId: string,
  workspaceName: string,
  workspaceLogo: string,
) => {
  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: STRUCTURED_WORKSPACES_TABLE,
    Key: {
      WorkspaceID: workspaceId,
    },
    UpdateExpression:
      'set WorkspaceName = :workspaceName, WorkspaceLogo = :workspaceLogo',
    ExpressionAttributeValues: {
      ':workspaceName': workspaceName,
      ':workspaceLogo': workspaceLogo, // Add this line
    },
    ReturnValues: 'UPDATED_NEW',
  };

  const result = await dynamoDb.update(params).promise();
  return result;
};

export async function POST(req: any) {
  try {
    const { WorkspaceName, WorkspaceId, WorkspaceLogo } = await req.json(); // Update this line
    const workspace = updateWorkspaceDetails(
      WorkspaceId,
      WorkspaceName,
      WorkspaceLogo,
    ); // Update this line
    return new Response(
      JSON.stringify({
        workspace,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error editing workspace details:', error);
    return new Response(
      JSON.stringify({
        error: error || 'Error setting up workspace',
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
