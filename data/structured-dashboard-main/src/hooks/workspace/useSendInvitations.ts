import { useAuthStore } from "zustand/auth/authStore";
import { useState } from "react";
import { WorkspaceMember, useWorkspaceStore } from "../../zustand/workspaces/workspaceStore";
import axios from "axios";

const useSendInvitations = () => {
    const [isLoadingSendInvitations, setIsLoadingSendInvitations] = useState(false);
    const { user } = useAuthStore();
    const { currentWorkspace, workspaceMembers, setWorkspaceMembers } = useWorkspaceStore();

    const sendInvitations = async (invitesEmails: string[]) => {
        if (!user || !currentWorkspace || !invitesEmails.length) return;
        setIsLoadingSendInvitations(true);
        try {
            const reponse = await axios.post('/api/workspaces/sendInvitation',
                {
                    userId: user?.sub,
                    userEmail: user?.email,
                    workspaceId: currentWorkspace.WorkspaceID,
                    workspaceName: currentWorkspace.WorkspaceName,
                    invitesEmails,
                });
            if (reponse.data.success) {
                setWorkspaceMembers([...workspaceMembers, ...reponse.data.newWorkspaceMembers as WorkspaceMember[]])
            }
        } catch (error) {
            console.error("Error sending invitations", error);
        } finally {
            setIsLoadingSendInvitations(false);
        }
    }
    return { isLoadingSendInvitations, sendInvitations };
}

export default useSendInvitations;