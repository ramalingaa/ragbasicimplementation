import { useAuthStore } from 'zustand/auth/authStore';
import axios from 'axios';
import {
  Workspace,
  WorkspaceMember,
  useWorkspaceStore,
} from '../../zustand/workspaces/workspaceStore';
import { useNotificationStore } from '../../zustand/notification/notificationStore';
import { useState } from 'react';

const useEditWorkspaceDetails = () => {
  const { user } = useAuthStore();
  const {
    availableWorkspaces,
    setAvailableWorkspaces,
    setCurrentWorkspace,
    currentWorkspace,
    workspaceMembers,
    setWorkspaceMembers,
  } = useWorkspaceStore();
  const { setNotificationState } = useNotificationStore();
  const [isEditWorkspaceLoading, setIsEditWorkspaceLoading] = useState(false);
  const editWorkspaceDetails = async (newWorkspaceDetails: Workspace) => {
    if (!user?.sub) return;
    setIsEditWorkspaceLoading(true);
    console.log({ newWorkspaceDetails });
    try {
      const response = await axios.post('/api/settings/editWorkspaceDetails', {
        WorkspaceName: newWorkspaceDetails.WorkspaceName,
        WorkspaceId: newWorkspaceDetails.WorkspaceID,
        WorkspaceLogo: newWorkspaceDetails.WorkspaceLogo,
      });
      console.log('response', response);
      if (response.data.workspace) {
        const updatedWorkspaces = availableWorkspaces.map((workspace) => {
          if (workspace.WorkspaceID === newWorkspaceDetails.WorkspaceID) {
            return newWorkspaceDetails;
          }
          return workspace;
        });
        setAvailableWorkspaces(updatedWorkspaces);
        setCurrentWorkspace(newWorkspaceDetails);
        setNotificationState(true, 'Workspace edited successfully', 'success');
      }
    } catch (error) {
      console.error('Error setting up workspace:', error);
      setNotificationState(true, 'Failed to edit workspace', 'failure');
    } finally {
      setIsEditWorkspaceLoading(false);
    }
  };
  const handleRoleChange = async (
    workspaceMemberUserId: string,
    newRole: string,
  ) => {
    if (!user?.sub) return;
    setIsEditWorkspaceLoading(true);
    try {
      const response = await axios.post('/api/settings/editWorkspaceRole', {
        WorkspaceId: currentWorkspace.WorkspaceID,
        userId: user?.sub,
        workspaceMemberUserId: workspaceMemberUserId,
        Role: newRole,
      });
      console.log('editWorkspaceRole resp', response.data);
      if (response.data.success) {
        let updatedWorkspaces = availableWorkspaces.map((workspace) => {
          if (workspace.WorkspaceID === currentWorkspace.WorkspaceID) {
            const updatedMembers = workspace.Members.map((member) => {
              if (member.userId === workspaceMemberUserId) {
                return { ...member, role: newRole };
              }
              return member;
            });
            return { ...workspace, Members: updatedMembers };
          }
          return workspace;
        });
        updatedWorkspaces = updatedWorkspaces.map((workspace) => {
          if (workspace.WorkspaceID === currentWorkspace.WorkspaceID) {
            const isCurrentUserAdmin = workspace.Members.some(
              (member) => member.userId === user.sub && member.role === 'admin',
            );
            setCurrentWorkspace({
              ...workspace,
              isCurrentUserAdmin,
            } as Workspace);
            return { ...workspace, isCurrentUserAdmin };
          }
          return workspace;
        });
        setAvailableWorkspaces(updatedWorkspaces as Workspace[]);
        setNotificationState(true, 'Role updated successfully', 'success');

        const updatedWorkspaceMembers = workspaceMembers.map((member) => {
          if (member.userId === workspaceMemberUserId) {
            return { ...member, role: newRole };
          }
          return member;
        });
        setWorkspaceMembers(updatedWorkspaceMembers as WorkspaceMember[]);
        return true;
      }
      setNotificationState(true, 'Failed to update role', 'failure');
      return false;
    } catch (error) {
      console.error('Error setting up workspace:', error);
      if (error instanceof Error) {
        setNotificationState(
          true,
          'Cannot change the role of the only admin in the workspace',
          'failure',
        );
      } else {
        setNotificationState(true, 'Failed to update role', 'failure');
      }
      return false;
    } finally {
      setIsEditWorkspaceLoading(false);
    }
  };
  const deleteCurrentWorkspace = async () => {
    if (!user?.sub) return;
    setIsEditWorkspaceLoading(true);
    try {
      const response = await axios.post('/api/settings/deleteWorkspace', {
        WorkspaceId: currentWorkspace.WorkspaceID,
        userId: user?.sub,
      });
      console.log('deleteWorkspace resp', response.data);
      if (response.data.success) {
        const updatedWorkspaces = availableWorkspaces.filter(
          (workspace) => workspace.WorkspaceID !== currentWorkspace.WorkspaceID,
        );
        setAvailableWorkspaces(updatedWorkspaces as Workspace[]);
        setCurrentWorkspace(updatedWorkspaces[0]);
        setNotificationState(true, 'Workspace deleted successfully', 'success');
        return true;
      }
      setNotificationState(true, 'Failed to delete workspace', 'failure');
      return false;
    } catch (error) {
      console.error('Error setting up workspace:', error);
      setNotificationState(true, 'Failed to delete workspace', 'failure');
      return false;
    } finally {
      setIsEditWorkspaceLoading(false);
    }
  };
  const leaveCurrentWorkspace = async () => {
    if (!user?.sub) return;
    setIsEditWorkspaceLoading(true);
    try {
      const response = await axios.post('/api/settings/leaveWorkspace', {
        WorkspaceId: currentWorkspace.WorkspaceID,
        userId: user?.sub,
      });
      console.log('leaveWorkspace resp', response.data);
      if (response.data.success) {
        const updatedWorkspaces = availableWorkspaces.filter(
          (workspace) => workspace.WorkspaceID !== currentWorkspace.WorkspaceID,
        );
        setAvailableWorkspaces(updatedWorkspaces as Workspace[]);
        setCurrentWorkspace(updatedWorkspaces[0]);
        setNotificationState(true, 'Left workspace successfully', 'success');
        return true;
      }
      setNotificationState(true, 'Failed to leave workspace', 'failure');
      return false;
    } catch (error) {
      console.error('Error setting up workspace:', error);
      setNotificationState(true, 'Failed to leave workspace', 'failure');
      return false;
    } finally {
      setIsEditWorkspaceLoading(false);
    }
  };
  const removeWorkspaceMember = async (workspaceMemberUserId: string) => {
    if (!user?.sub) return;
    setIsEditWorkspaceLoading(true);
    try {
      const response = await axios.post('/api/settings/removeWorkspaceMember', {
        WorkspaceId: currentWorkspace.WorkspaceID,
        userId: user?.sub,
        workspaceMemberUserId: workspaceMemberUserId,
      });
      if (response.data.success) {
        const updatedWorkspaces = availableWorkspaces.map((workspace) => {
          if (workspace.WorkspaceID === currentWorkspace.WorkspaceID) {
            const updatedMembers = workspace.Members.filter(
              (member) => member.userId !== workspaceMemberUserId,
            );
            return { ...workspace, Members: updatedMembers };
          }
          return workspace;
        });
        setAvailableWorkspaces(updatedWorkspaces as Workspace[]);
        setNotificationState(true, 'Member removed successfully', 'success');

        const updatedWorkspaceMembers = workspaceMembers.filter(
          (member) => member.userId !== workspaceMemberUserId,
        );
        setWorkspaceMembers(updatedWorkspaceMembers as WorkspaceMember[]);
        return true;
      }
      setNotificationState(true, 'Failed to remove member', 'failure');
      return false;
    } catch (error) {
      console.error('Error setting up workspace:', error);
      setNotificationState(true, 'Failed to remove member', 'failure');
      return false;
    } finally {
      setIsEditWorkspaceLoading(false);
    }
  };

  const removePendingInviteToMember = async (invitationID: string) => {
    if (!user?.sub) return;
    try {
      const response = await axios.post('/api/settings/removeInviteToMember', {
        WorkspaceId: currentWorkspace.WorkspaceID,
        userId: user?.sub,
        invitationId: invitationID,
      });
      if (response.data.success) {
        const updatedWorkspaceMembers = workspaceMembers.filter(
          (member) => member?.invitationID !== invitationID,
        );
        setWorkspaceMembers(updatedWorkspaceMembers as WorkspaceMember[]);
        setNotificationState(
          true,
          'Pending invite removed successfully',
          'success',
        );
        return true;
      }
      setNotificationState(true, 'Failed to remove pending invite', 'failure');
      return false;
    } catch (error) {
      console.error('Error setting up workspace:', error);
      setNotificationState(true, 'Failed to remove member', 'failure');
      return false;
    }
  };

  return {
    removePendingInviteToMember,
    editWorkspaceDetails,
    isEditWorkspaceLoading,
    handleRoleChange,
    deleteCurrentWorkspace,
    leaveCurrentWorkspace,
    removeWorkspaceMember,
  };
};

export default useEditWorkspaceDetails;
