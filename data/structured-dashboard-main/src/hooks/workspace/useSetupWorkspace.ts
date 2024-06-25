import { useAuthStore } from "zustand/auth/authStore";
import axios from "axios";
import { Workspace, WorkspaceMember, useWorkspaceStore } from "../../zustand/workspaces/workspaceStore";
import { useState } from "react";
import useDisclosure from "hooks/useDisclosure";

const useSetupWorkspace = () => {
    const { user } = useAuthStore();
    const { setCurrentWorkspace, setAvailableWorkspaces, setWorkspaceMembers, currentWorkspace, setNewInvitations } = useWorkspaceStore();
    const [isLoading, setIsLoading] = useState(false);
    const {
        isOpen: isNewInvitationsModalOpen,
        onOpen: onNewInvitationsModalOpen,
        onClose: onNewInvitationsModalClose,
    } = useDisclosure();
    const initWorkspaceSettings = async () => {
        if (!user) return;
        try {
            console.log(user);
            const response = await axios.post('/api/workspaces/setupWorkspaces', {
                userEmail: user?.email,
                userId: user?.sub,
            });
            console.log("setupWorkspaces ", response.data)
            if (response.data.workspaces) {
                setAvailableWorkspaces(response.data.workspaces);
                if (!currentWorkspace || !response.data.workspaces.find((workspace: Workspace) => workspace.WorkspaceID === currentWorkspace.WorkspaceID)) {
                    setCurrentWorkspace(response.data.workspaces[0]);
                }
                const foundCurrentWorkpaceFromResponse = response.data.workspaces.find((workspace: Workspace) => workspace.WorkspaceID === currentWorkspace.WorkspaceID)
                if (currentWorkspace && foundCurrentWorkpaceFromResponse && JSON.stringify(foundCurrentWorkpaceFromResponse) != JSON.stringify(currentWorkspace)) {
                    setCurrentWorkspace(foundCurrentWorkpaceFromResponse);
                }
            }
            if (response.data.invitations.length) {
                setNewInvitations(response.data.invitations);
                onNewInvitationsModalOpen();
            }
        } catch (error) {
            console.error("Error setting up workspace:", error);
        }
    };
    const getWorkspaceMembers = async () => {
        console.log("[getWorkspaceMembers] init")
        if (!user || !currentWorkspace) return;
        console.log("[getWorkspaceMembers] init - 1")
        setIsLoading(true);
        try {
            const response = await axios.post('/api/workspaces/getWorkspaceMembers', {
                userId: user?.sub,
                workspaceId: currentWorkspace.WorkspaceID,
            });
            const members = await response.data.members as WorkspaceMember[];
            console.log("members", members)
            setWorkspaceMembers(members);
        } catch (error) {
            console.error("Error getting workspace members:", error);
        } finally {
            setIsLoading(false);
        }
    }
    return {
        initWorkspaceSettings, getWorkspaceMembers, isLoading, isNewInvitationsModalOpen,
        onNewInvitationsModalOpen,
        onNewInvitationsModalClose
    };
}

export default useSetupWorkspace;