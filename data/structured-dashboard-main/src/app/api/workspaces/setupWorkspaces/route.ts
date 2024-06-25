import AWS from 'aws-sdk';
import { create } from 'domain';
import { getDefaultWorkspaceKey, updateUserEmail } from 'utils/aws_helpers';
import { DEFAULT_WORKSPACE_NAME, STRUCTURED_INVITATIONS_DATA_TABLE, STRUCTURED_USER_PROFILE_DATA_TABLE, STRUCTURED_WORKSPACES_TABLE } from 'utils/constants';
import { v4 } from 'uuid';

// AWS SDK configuration
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

// const userEntryExistsInUserProfileTable = await checkIfUserEntryExistsInUserProfileTable(userId);
// if(userEntryExistsInUserProfileTable) {
//     const updateParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
//         TableName: STRUCTURED_USER_PROFILE_DATA_TABLE,
//         Key: {
//             userId,
//         },
//         UpdateExpression: 'SET workspaceId = :workspaceId',
//         ExpressionAttributeValues: {
//             ':workspaceId': workspaceId,
//         },
//     };
//     const updateResponse = await dynamoDb.update(updateParams).promise();
//     return updateResponse;
// } else {
//     const createParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
//         TableName: STRUCTURED_USER_PROFILE_DATA_TABLE,
//         Item: {
//             userId,
//             workspaceId,
//         },
//     };
//     const createResponse = await dynamoDb.put(createParams).promise();
//     return createResponse;

// }
// async function getAllWorkspaces() {
//     const params = {
//         TableName: STRUCTURED_WORKSPACES_TABLE,
//     };
//     try {
//         const response = await dynamoDb.scan(params).promise();
//         return response.Items;
//     } catch (error) {
//         console.error("Error fetching workspaces:", error);
//         throw error;
//     }
// }
// const workspaces = await getAllWorkspaces();

async function createDefaultWorkspace(userId: string) {
    const workspaceId = getDefaultWorkspaceKey(userId)
    const Item = {
        WorkspaceID: workspaceId,
        WorkspaceName: DEFAULT_WORKSPACE_NAME,
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
    const userWorkspacesList = [workspaceId];

    // Creating a new entry in the user profile table
    const userProfileTableParams: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: STRUCTURED_USER_PROFILE_DATA_TABLE,
        Item: {
            userId,
            WorkspaceIDs: userWorkspacesList,
        },
    };

    const putUserProfilesTable = await dynamoDb.put(userProfileTableParams).promise();
    console.log({ putUserProfilesTable })

    // Updating the workspaceId in the user profile table
    const userProfilesTableUpdateparams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: STRUCTURED_USER_PROFILE_DATA_TABLE,
        Key: {
            userId,
        },
        UpdateExpression:
            'set WorkspaceIDs = :e',
        ExpressionAttributeValues: {
            ':e': userWorkspacesList
        },
        ReturnValues: 'UPDATED_NEW',
    };

    const updateUserProfilesTable = await dynamoDb.update(userProfilesTableUpdateparams).promise();
    console.log({ updateUserProfilesTable })

    return Item;
}
async function checkWhetherUserHasDefaultWorkspace(userId: string) {
    const params = {
        TableName: STRUCTURED_WORKSPACES_TABLE,
        Key: {
            WorkspaceID: getDefaultWorkspaceKey(userId),
        },
    };
    try {
        const response = await dynamoDb.get(params).promise();
        return !!response.Item;
    } catch (error) {
        console.error("Error fetching workspaces:", error);
        return false;
    }
}
async function returnDefaultWorkspace(userId: string) {
    const params = {
        TableName: STRUCTURED_WORKSPACES_TABLE,
        Key: {
            WorkspaceID: getDefaultWorkspaceKey(userId),
        },
    };
    try {
        const response = await dynamoDb.get(params).promise();
        return response.Item;
    } catch (error) {
        console.error("Error fetching workspaces:", error);
        return false;
    }
}

async function returnAllUserWorkspaces(userId: string) {
    const params = {
        TableName: STRUCTURED_USER_PROFILE_DATA_TABLE,
        Key: {
            userId,
        },
    };
    const response = await dynamoDb.get(params).promise();

    const workspaceIds = response.Item.WorkspaceIDs;
    const workspaces = await Promise.all(workspaceIds.map(async (workspaceId: string) => {
        const params = {
            TableName: STRUCTURED_WORKSPACES_TABLE,
            Key: {
                WorkspaceID: workspaceId,
            },
        };
        const response = await dynamoDb.get(params).promise();
        return response.Item;
    }));
    for(const workspace of workspaces) {
        workspace.isCurrentUserAdmin = workspace.Members.some((member: any) => member.userId === userId && member.role === 'admin');
        try{
            workspace.entityTypes = workspace?.entityTypes ? JSON.parse(workspace?.entityTypes) : [];
        } catch (error) {
            workspace.entityTypes = null
        }
    }
    return workspaces;
}

async function fetchNewInvitations(userEmail: string) {
    const params = {
        TableName: STRUCTURED_INVITATIONS_DATA_TABLE,
        FilterExpression: 'Email = :email AND #invitation_status = :status',
        ExpressionAttributeValues: {
            ':email': userEmail,
            ':status': 'pending',
        },
        ExpressionAttributeNames: {
            "#invitation_status": "Status"
        }
    };
    const response = await dynamoDb.scan(params).promise();
    let invitations = response.Items;
    for (const invitation of invitations) {
        const workspaceParams = {
            TableName: STRUCTURED_WORKSPACES_TABLE,
            Key: {
                WorkspaceID: invitation.WorkspaceID,
            },
        };
        const workspaceResponse = await dynamoDb.get(workspaceParams).promise();
        invitation.WorkspaceName = workspaceResponse.Item.WorkspaceName;
    }
    // get user names/emails in invitedBy field
    for (const invitation of invitations) {
        const invitedBy = invitation.InvitedBy;
        const userParams = {
            TableName: STRUCTURED_USER_PROFILE_DATA_TABLE,
            Key: {
                userId: invitedBy,
            },
        };
        const userResponse = await dynamoDb.get(userParams).promise();
        invitation.InvitedBy = "";
        if(userResponse.Item.name){
            invitation.InvitedBy = userResponse.Item.name;
        } else if(userResponse.Item.email){
            invitation.InvitedBy = userResponse.Item.email;
        }
    }
    return invitations;
}

export async function POST(req: any) {
    try {
        const { userId, userEmail } = await req.json();
        console.log({ userId })
        if (!userId || !userEmail) {
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
        const hasWorkspace = await checkWhetherUserHasDefaultWorkspace(userId);
        if (!hasWorkspace) {
            const workspace = await createDefaultWorkspace(userId);
        }
        const updateUserEmailResp = await updateUserEmail(userId, userEmail);
        const workspaces = await returnAllUserWorkspaces(userId);
        const invitations = await fetchNewInvitations(userEmail);
        return new Response(
            JSON.stringify({
                workspaces,
                invitations,
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );
    }
    catch (error) {
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