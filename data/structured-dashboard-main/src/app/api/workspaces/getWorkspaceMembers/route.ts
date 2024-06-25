import AWS from 'aws-sdk';
import { create } from 'domain';
import { getDefaultWorkspaceKey } from 'utils/aws_helpers';
import { DEFAULT_WORKSPACE_NAME, INVITATION_STATUS, STRUCTURED_INVITATIONS_DATA_TABLE, STRUCTURED_USER_PROFILE_DATA_TABLE, STRUCTURED_WORKSPACES_TABLE, WORKSPACE_ROLE } from 'utils/constants';
import { v4 } from 'uuid';

// AWS SDK configuration
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
async function getWorkspaceMembers(userId: string, workspaceId: string) {
    const params = {
        TableName: STRUCTURED_WORKSPACES_TABLE,
        Key: {
            WorkspaceID: workspaceId,
        },
    };
    return dynamoDb.get(params).promise().then((data) => {
        return data.Item.Members;
    });
}

async function getAllMembersDetails(members: any, workspaceId:string) {
    const membersDetails = [];
    for (const member of members) {
        const params = {
            TableName: STRUCTURED_USER_PROFILE_DATA_TABLE,
            Key: {
                userId: member.userId,
            },
        };
        const memberDetails = await dynamoDb.get(params).promise();
        const memberDetailsObj = {
            userId: member.userId,
            name: memberDetails.Item?.name,
            email: memberDetails.Item?.email,
            role:"",
        }
        membersDetails.push(memberDetailsObj);
    }

    // get invited members
    const params = {
        TableName: STRUCTURED_INVITATIONS_DATA_TABLE,
        FilterExpression: 'WorkspaceID = :workspaceId',
        ExpressionAttributeValues: {
            ':workspaceId': workspaceId,
        },
    };
    const invitedMembers = await dynamoDb.scan(params).promise();
    for (const member of invitedMembers.Items) {
        // if member is already part of membersDetails with common email
        if(membersDetails.find((memberDetail) => memberDetail.email === member.Email)){
            continue;
        }
        const memberDetailsObj = {
            userId: v4(),
            email: member.Email,
            role:"member",
            invitationStatus: member.Status,
            invitationID: member.InvitationID,
        }
        membersDetails.push(memberDetailsObj);
    }
    return membersDetails;
}

export async function POST(req: any) {
    try {
        const {
            userId,
            workspaceId } = await req.json();
        if (!userId || !workspaceId) {
            throw new Error("Missing required fields");
        }
        const workspaceMembers = await getWorkspaceMembers(userId, workspaceId);
        if (!workspaceMembers.find((member: any) => member.userId === userId)) {
            throw new Error("User is not part of this workspace");
        }

        let membersDetails = await getAllMembersDetails(workspaceMembers, workspaceId);
        for(const member of membersDetails){
            for(const workspaceMember of workspaceMembers){
                if(member.userId === workspaceMember.userId){
                    member.role = workspaceMember.role;
                }
            }
        }
        console.log({membersDetails})
        return new Response(JSON.stringify({ members: membersDetails }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    catch (error) {
        return new Response(
            JSON.stringify({ error: error || "Error occurred " }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
}