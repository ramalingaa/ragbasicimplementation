import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WorkspaceMember = {
  userId: string;
  name?: string;
  nickanme?: string;
  email?: string;
  image?: string;
  role: 'admin' | 'member';
  invitationStatus: 'pending' | 'accepted' | 'declined';
  invitationID?: string;
};

export type Workspace = {
  WorkspaceID: string;
  WorkspaceName: string;
  WorkspaceLogo?: string; // Added WorkspaceLogo property
  CreationDate: string;
  Members: WorkspaceMember[];
  isCurrentUserAdmin?: boolean;
  entityTypes?: any;
  dbDetails?: any;
};

export interface Invitation {
  WorkspaceRole: string;
  WorkspaceID: string;
  ExpirationDate: string;
  Status: string;
  InvitationID: string;
  InvitedBy: string;
  Email: string;
  CreatedAt: string;
  WorkspaceName: string;
  InvitationFromEmail?: string;
}

interface WorkspaceState {
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: (workspace: Workspace) => void;
  availableWorkspaces: Workspace[];
  setAvailableWorkspaces: (workspaces: Workspace[]) => void;
  workspaceMembers: WorkspaceMember[];
  setWorkspaceMembers: (members: WorkspaceMember[]) => void;
  // invitations
  newInvitations: Invitation[];
  setNewInvitations: (invitations: Invitation[]) => void;
}

export const workspaceStore = create<
  WorkspaceState,
  [['zustand/persist', WorkspaceState]]
>(
  persist(
    (set, get) => ({
      currentWorkspace: null,
      setCurrentWorkspace: (workspace: Workspace) =>
        set({ currentWorkspace: workspace }),
      availableWorkspaces: [],
      setAvailableWorkspaces: (workspaces: Workspace[]) =>
        set({ availableWorkspaces: workspaces }),
      workspaceMembers: [],
      setWorkspaceMembers: (members: WorkspaceMember[]) =>
        set({ workspaceMembers: members }),
      newInvitations: [],
      setNewInvitations: (invitations: Invitation[]) =>
        set({ newInvitations: invitations }),
    }),
    {
      name: 'WorkspaceStore',
    },
  ),
);

export const useWorkspaceStore = workspaceStore;
