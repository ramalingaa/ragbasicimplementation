import AWS from 'aws-sdk';
import { create } from 'domain';
import { getDefaultWorkspaceKey } from 'utils/aws_helpers';
import { DEFAULT_WORKSPACE_NAME, STRUCTURED_USER_PROFILE_DATA_TABLE, STRUCTURED_WORKSPACES_TABLE } from 'utils/constants';
import { convertStringToAlphanumericAndUnderscoresString, createDataset } from 'utils/gcp_helpers';
import { v4 } from 'uuid';

// AWS SDK configuration
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function createNewWorkspace(userId: string, workspaceName: string) {
    const workspaceId = v4();
    const Item = {
        WorkspaceID: workspaceId,
        WorkspaceName: workspaceName,
        CreationDate: new Date().toISOString(),
        Members: [{
            userId,
            role: 'admin',
        }],
    }
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: STRUCTURED_WORKSPACES_TABLE,
        Item: Item,
    };
    const updateWorkspaceTable = await dynamoDb.put(params).promise();

    // Updating the workspaceId in the user profile table
    const userProfilesTableUpdateparams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: STRUCTURED_USER_PROFILE_DATA_TABLE,
        Key: {
            userId,
        },
        UpdateExpression: "SET WorkspaceIDs = list_append(WorkspaceIDs, :newWorkspaceId)",
        ExpressionAttributeValues: {
            ":newWorkspaceId": [workspaceId],
        },
        ReturnValues: 'UPDATED_NEW',
    };

    const updateUserProfilesTable = await dynamoDb.update(userProfilesTableUpdateparams).promise();

    // BigQuery Ops
    await createDataset(convertStringToAlphanumericAndUnderscoresString(workspaceId));

    return Item;
}

export async function POST(req: any) {
    try {
        const { userId, workspaceName } = await req.json();
        const workspace = await createNewWorkspace(userId, workspaceName);
        return new Response(
            JSON.stringify({
                workspace: {...workspace, isCurrentUserAdmin: true},
            }),
            {
                status: 201,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    } catch (error) {
        console.error("Error creating new workspace:", error);
        return new Response(
            JSON.stringify({
                error: "Error creating new workspace",
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