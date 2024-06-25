import { deleteWorkspaceDatasources, deleteWorkspaceEntry, deleteWorkspaceFiles, deleteWorkspaceInvitations, getWorkspaceDetails, removeWorkspaceFromUserProfiles } from 'utils/aws_helpers';
import { ENTITY_TYPE_FILES_DIR } from 'utils/constants';

// Refactored deleteWorkspace function
async function deleteWorkspace(WorkspaceId: string, userId: string) {
    const workspaceData = await getWorkspaceDetails(WorkspaceId);
    const workspaceMembers = workspaceData.Item.Members;

    // check if the userId is the only admin in the workspace
    const admins = workspaceMembers.filter((member: any) => member.role === 'admin');
    if (admins.length > 1){
        throw new Error("Cannot delete because there are other admins in the workspace");
    }

    await deleteWorkspaceEntry(WorkspaceId);
    await removeWorkspaceFromUserProfiles(WorkspaceId, workspaceMembers);
    await deleteWorkspaceFiles(WorkspaceId);
    await deleteWorkspaceFiles(WorkspaceId, ENTITY_TYPE_FILES_DIR);
    await deleteWorkspaceInvitations(WorkspaceId);
    await deleteWorkspaceDatasources(WorkspaceId);

    // TODO: Clear queries, reports
    return true;
}

export async function POST(req: any) {
    try {
        const { WorkspaceId, userId } = await req.json();

        const success = await deleteWorkspace(WorkspaceId, userId);
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