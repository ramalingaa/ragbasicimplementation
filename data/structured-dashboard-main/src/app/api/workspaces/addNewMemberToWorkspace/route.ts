import AWS from 'aws-sdk';
import { STRUCTURED_INVITATIONS_DATA_TABLE, STRUCTURED_USER_PROFILE_DATA_TABLE, STRUCTURED_WORKSPACES_TABLE } from 'utils/constants';

// AWS SDK configuration
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();
async function addNewMemberToWorkspace(userId: string, workspaceId: string, invitationId: string) {
    const params1 = {
        TableName: STRUCTURED_WORKSPACES_TABLE,
        Key: {
            WorkspaceID: workspaceId,
        },
        UpdateExpression: 'SET Members = list_append(Members, :newMember)',
        ExpressionAttributeValues: {
            ':newMember': [
                {
                    userId,
                    role: 'member',
                },
            ],
        },
        ReturnValues: 'ALL_NEW',
    };
    const resp = await dynamoDb.update(params1).promise();

    const params2 = {
        TableName: STRUCTURED_USER_PROFILE_DATA_TABLE,
        Key: {
            userId,
        },
        UpdateExpression: 'SET WorkspaceIDs = list_append(WorkspaceIDs, :workspaceId)',
        ExpressionAttributeValues: {
            ':workspaceId': [workspaceId],
        },
    };
    const resp2 = await dynamoDb.update(params2).promise();
    console.log("resp", resp);

    const params3 = {
        TableName: STRUCTURED_INVITATIONS_DATA_TABLE,
        Key: {
            InvitationID: invitationId,
        },
        UpdateExpression: 'SET #invitation_status = :status',
        ExpressionAttributeValues: {
            ':status': 'accepted',
        },
        ExpressionAttributeNames: {
            "#invitation_status": "Status"
        },
    };
    const resp3 = await dynamoDb.update(params3).promise();

    return resp.Attributes;
}

async function checkIfUserIsMemberOfWorkspace(userId: string, workspaceId: string, invitationId: string) {
    const params = {
        TableName: STRUCTURED_WORKSPACES_TABLE,
        Key: {
            WorkspaceID: workspaceId,
        },
    };
    const response = await dynamoDb.get(params).promise();
    const isUserAlreadyMember = response.Item.Members.find((member: any) => member.userId === userId);

    const params1 = {
        TableName: STRUCTURED_INVITATIONS_DATA_TABLE,
        Key: {
            InvitationID: invitationId,
        },
        UpdateExpression: 'SET #invitation_status = :status',
        ExpressionAttributeValues: {
            ':status': 'accepted',
        },
        ExpressionAttributeNames: {
            "#invitation_status": "Status"
        },
    }
    await dynamoDb.update(params1).promise();
    return isUserAlreadyMember;
}

export async function POST(req: any) {
    try {
        const { userId, workspaceId, invitationId } = await req.json();
        if (!userId || !workspaceId || !invitationId) {
            throw new Error("Missing required fields");
        }
        // check if user is already a part of the workspace
        const isUserAlreadyMember = await checkIfUserIsMemberOfWorkspace(userId, workspaceId, invitationId);
        if (isUserAlreadyMember) {
            throw new Error("User is already a member of this workspace");
        }
        const workspace = await addNewMemberToWorkspace(userId, workspaceId, invitationId);
        return new Response(
            JSON.stringify({ workspace }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    } catch (error) {
        console.error("Error adding member to workspace:", error);
        return new Response(
            JSON.stringify({ error: error || "Failed to add member to workspace" }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    }
}