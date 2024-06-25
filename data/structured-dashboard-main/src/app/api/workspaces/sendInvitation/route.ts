import AWS from 'aws-sdk';
import { create } from 'domain';
import { getDefaultWorkspaceKey } from 'utils/aws_helpers';
import { DEFAULT_WORKSPACE_NAME, INVITATION_STATUS, STRUCTURED_INVITATIONS_DATA_TABLE, STRUCTURED_USER_PROFILE_DATA_TABLE, STRUCTURED_WORKSPACES_TABLE, WORKSPACE_ROLE } from 'utils/constants';
import { sendInvitationEmails } from 'utils/resend_helpers';
import { v4 } from 'uuid';

// AWS SDK configuration
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function checkIfUserIsAdminOfWorkspace(userId: string, WorkspaceID: string) {
    const params = {
        TableName: STRUCTURED_WORKSPACES_TABLE,
        Key: {
            WorkspaceID,
        },
    };
    return dynamoDb.get(params).promise().then((data) => {
        return data.Item.Members.find((member: any) => member.userId === userId && member.role === 'admin');
    });
}

async function sendInvitations(invitesEmails: string[], workspaceId: string, userId: string, userEmail: string) {
    let newWorkspaceMembers = [];
    for (const email of invitesEmails) {
        const invitationId = v4();
        const params = {
            TableName: STRUCTURED_INVITATIONS_DATA_TABLE,
            Item: {
                InvitationID: invitationId,
                WorkspaceID: workspaceId,
                Email: email,
                InvitedBy: userId,
                InvitationFromEmail: userEmail,
                CreatedAt: new Date().toISOString(),
                Status: INVITATION_STATUS.PENDING,
                WorkspaceRole: WORKSPACE_ROLE.MEMBER,
                ExpirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            },
        };
        newWorkspaceMembers.push({
            invitationID: invitationId,
            email,
            invitationStatus: INVITATION_STATUS.PENDING,
            role: WORKSPACE_ROLE.MEMBER,
            userId: '',
        })
        const respone = await dynamoDb.put(params).promise();
    }
    return newWorkspaceMembers;
}

export async function POST(req: any) {
    try {
        const {
            workspaceId,
            invitesEmails,
            workspaceName,
            userId,
            userEmail,
        } = await req.json();
        if (!workspaceId || !invitesEmails || !userId) {
            throw new Error("Missing required fields");
        }
        const userIsAdmin = await checkIfUserIsAdminOfWorkspace(userId, workspaceId);
        if (!userIsAdmin) {
            throw new Error("User is not an admin of this workspace");
        }
        const newWorkspaceMembers = await sendInvitations(invitesEmails, workspaceId, userId, userEmail);
        await sendInvitationEmails(invitesEmails, workspaceName);
        return new Response(
            JSON.stringify({
                message: "Invitations sent successfully",
                success: true,
                newWorkspaceMembers,
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    } catch (error) {
        console.log("Error in setupWorkspaces route", error)
        return new Response(
            JSON.stringify({
                error: error || "Error setting up workspace",
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