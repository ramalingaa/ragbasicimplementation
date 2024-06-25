import { useAuthStore } from "zustand/auth/authStore";
import axios from "axios";
import { useWorkspaceStore } from "../../zustand/workspaces/workspaceStore";
import { useNotificationStore } from '../../zustand/notification/notificationStore';
import { useState } from "react";

const useCreateWorkspace = () => {
    const { user } = useAuthStore();
    const { availableWorkspaces, setAvailableWorkspaces, setCurrentWorkspace } = useWorkspaceStore();
    const {
        setNotificationState,
    } = useNotificationStore();
    const [isCreateNewWorkspaceLoading, setIsCreateNewWorkspaceLoading] = useState(false);

    const createNewWorkspace = async (workspaceName: string) => {
        if (!user?.sub) return;
        setIsCreateNewWorkspaceLoading(true)
        try {
            const response = await axios.post('/api/settings/createNewWorkspace', {
                userId: user?.sub,
                workspaceName: workspaceName,
            });
            console.log("response", response);
            if (response.data.workspace) {
                setAvailableWorkspaces([...availableWorkspaces, response.data.workspace]);
                setNotificationState(true, 'Workspace created successfully', 'success');
                setCurrentWorkspace(response.data.workspace);
            }
        } catch (error) {
            console.error("Error setting up workspace:", error);
            setNotificationState(true, 'Failed to create workspace', 'failure');
        } finally {
            setIsCreateNewWorkspaceLoading(false);
        }
    };
    const addNewMemberToWorkspace = async (workspaceId: string, invitationId: string) => {
        if (!user?.sub) return;
        setIsCreateNewWorkspaceLoading(true)
        try {
            const response = await axios.post('/api/workspaces/addNewMemberToWorkspace', {
                userId: user?.sub,
                workspaceId: workspaceId,
                invitationId,
            });
            console.log("response", response);
            if (response.data.workspace) {
                setAvailableWorkspaces([...availableWorkspaces, response.data.workspace]);
                setNotificationState(true, 'Member added successfully', 'success');
            }
        } catch (error) {
            setNotificationState(true, 'Failed to add member to workspace', 'failure');
        } finally {
            setIsCreateNewWorkspaceLoading(false);
        }
    }
    const declineInvitation = async (invitationId: string) => {
        if (!user?.sub) return;
        setIsCreateNewWorkspaceLoading(true)
        try {
            const response = await axios.post('/api/workspaces/declineInvitation', {
                userId: user?.sub,
                invitationId,
            });
            console.log("response", response);
            if (response.data.success) {
                setNotificationState(true, 'Invitation declined successfully', 'success');
            }
        } catch (error) {
            setNotificationState(true, 'Failed to decline invitation', 'failure');
        } finally {
            setIsCreateNewWorkspaceLoading(false);
        }
    }
    return {
        createNewWorkspace, isCreateNewWorkspaceLoading, addNewMemberToWorkspace, declineInvitation,
        // isWorkspaceCreationModalOpen,
        // onWorkspaceCreationModalOpen,
        // onWorkspaceCreationModalClose,
    };
}

export default useCreateWorkspace;