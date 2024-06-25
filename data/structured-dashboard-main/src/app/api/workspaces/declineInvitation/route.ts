import AWS from 'aws-sdk';
import { create } from 'domain';
import { checkCustomRoutes } from 'next/dist/lib/load-custom-routes';
import { getDefaultWorkspaceKey } from 'utils/aws_helpers';
import { DEFAULT_WORKSPACE_NAME, STRUCTURED_INVITATIONS_DATA_TABLE, STRUCTURED_USER_PROFILE_DATA_TABLE, STRUCTURED_WORKSPACES_TABLE } from 'utils/constants';
import { v4 } from 'uuid';

// AWS SDK configuration
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function declineInvitation(invitationId: string) {
    const params = {
        TableName: STRUCTURED_INVITATIONS_DATA_TABLE,
        Key: {
            InvitationID: invitationId,
        },
        UpdateExpression: 'SET #invitation_status = :status',
        ExpressionAttributeValues: {
            ':status': 'declined',
        },
        ExpressionAttributeNames: {
            "#invitation_status": "Status"
        },
    };
    const resp = await dynamoDb.update(params).promise();
    return resp.Attributes;
}
export async function POST(req: any) {
    try {
        const {
            userId,
            invitationId,
        } = await req.json();

        const response = await declineInvitation(invitationId);

        return new Response(
            JSON.stringify({ response, success: true }),
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