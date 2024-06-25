import { getWorkspaceDetails, removeWorkspaceFromUserProfile, removeWorkspaceMember } from "utils/aws_helpers";

async function leaveWorkspace(workspaceId: string, userId: string) {
    const workspaceData = await getWorkspaceDetails(workspaceId);
    const workspaceMembers = workspaceData.Item.Members;

    // check if the userId is the only admin in the workspace
    const admins = workspaceMembers.filter((member: any) => member.role === 'admin');
    if (admins.length === 1 && admins[0].userId === userId){
        throw new Error("Cannot delete because current user is the only admin in the workspace");
    }

    // remove the workspace from the user profile
    await removeWorkspaceFromUserProfile(workspaceId, userId);
    
    // update workspace members
    const updatedMembers = workspaceMembers.filter((member: any) => member.userId !== userId);
    await removeWorkspaceMember(workspaceId, updatedMembers, userId);

    return true;
}

export async function POST(req: any) {
    try {
        const { WorkspaceId, userId } = await req.json();

        const success = await leaveWorkspace(WorkspaceId, userId);
        return new Response(
            JSON.stringify({ success }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    } catch (error) {
        console.error("Error deleting workspace:", error);
        return new Response(
            JSON.stringify({ error: error || "Failed to delete workspace" }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    }
}
