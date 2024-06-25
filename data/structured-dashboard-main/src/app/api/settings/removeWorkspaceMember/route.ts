import { getWorkspaceDetails, removeWorkspaceFromUserProfile, removeWorkspaceMember } from "utils/aws_helpers";

async function removeWorkspaceMemberFromWorkspace(workspaceId: string, userId: string, workspaceMemberUserId: string) {
    const workspaceData = await getWorkspaceDetails(workspaceId);
    const workspaceMembers = workspaceData.Item.Members;
    const isAdmin = workspaceMembers.filter((member: any) => member.role === 'admin' && member.userId == userId).length === 1;
    if (!isAdmin) {
        throw new Error("Cannot delete because current user is not an admin in the workspace");
    }
    const isDeletingAdmin = workspaceMembers.filter((member: any) => member.role === 'admin' && member.userId == workspaceMemberUserId).length === 1;
    if (isDeletingAdmin) {
        throw new Error("Cannot delete because the user is the only admin in the workspace");
    }
    // remove the workspace from the user profile
    await removeWorkspaceFromUserProfile(workspaceId, workspaceMemberUserId);

    // update workspace members
    const updatedMembers = workspaceMembers.filter((member: any) => member.userId !== workspaceMemberUserId);
    await removeWorkspaceMember(workspaceId, updatedMembers, workspaceMemberUserId);
    return true;
}

export async function POST(req: any) {
    try {
        const {
            WorkspaceId,
            userId,
            workspaceMemberUserId,
        } = await req.json();

        const success = await removeWorkspaceMemberFromWorkspace(WorkspaceId, userId, workspaceMemberUserId);
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