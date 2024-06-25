import AWS from 'aws-sdk';
import { STRUCTURED_WORKSPACES_TABLE } from 'utils/constants';

// AWS SDK configuration
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function editWorkspaceRole(workspaceId: string, userId: string, newRole: string) {
    const params1 = {
        TableName: STRUCTURED_WORKSPACES_TABLE,
        Key: {
            WorkspaceID: workspaceId,
        },
    };

    // Fetch the workspace from DynamoDB
    const workspaceResponse = await dynamoDb.get(params1).promise();
    const workspaceItem = workspaceResponse.Item;

    // Make sure the workspace and its Members list exist
    if (!workspaceItem || !Array.isArray(workspaceItem.Members)) {
        console.error('Workspace not found or does not contain a Members list');
        return;
    }

    // find number of admins in the workspace
    const admins = workspaceItem.Members.filter(member => member.role === 'admin');
    if (admins.length === 1 && admins[0].userId === userId && newRole === 'member') {
        throw Error('Cannot change the role of the only admin in the workspace');
    }

    console.log({userId})
    console.log(workspaceItem.Members)
    // Find the index of the member with the given userId
    const memberIndex = workspaceItem.Members.findIndex(member =>
        member.userId === userId
    );

    console.log({ memberIndex });

    // Check if the member was found
    if (memberIndex !== -1) {
        const params2 = {
            TableName: STRUCTURED_WORKSPACES_TABLE,
            Key: {
                WorkspaceID: workspaceItem.WorkspaceID,
            },
            UpdateExpression: `SET Members[${memberIndex}].#r = :newRole`,
            ExpressionAttributeValues: {
                ':newRole': newRole,
            },
            ExpressionAttributeNames: {
                '#r': 'role',
            },
            ReturnValues: 'ALL_NEW',
        };

        // Update the member's role in DynamoDB
        await dynamoDb.update(params2).promise();
        console.log("Role updated successfully");
    } else {
        console.log("Member not found in the workspace");
    }
}


export async function POST(req: any) {
    try {
        const {
            WorkspaceId,
            userId,
            workspaceMemberUserId,
            Role,
        } = await req.json();
        // TODO: Add validation whether userID is admin
        await editWorkspaceRole(WorkspaceId, workspaceMemberUserId, Role);
        return new Response(
            JSON.stringify({ success: true, message: "Workspace role edited successfully" }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    } catch (error) {
        console.error("Error editing workspace role:", error);
        return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "Failed to edit workspace role" }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    }
}