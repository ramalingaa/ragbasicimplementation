export const DATASOURCES_DIR = "uploadedFiles"
export const ENTITY_TYPE_FILES_DIR = "entityTypeFiles"
export const STRUCTURED_HARBOR_FILE_METADATA_TABLE = "structured-harbor-file-metadata"
export const STRUCTURED_USER_PROFILE_DATA_TABLE = "structured-user-profile-data"
export const STRUCTURED_INVITATIONS_DATA_TABLE = "structured-invitations-data"
export const STRUCTURED_WORKSPACES_TABLE = "structured-workspaces"
export const DEFAULT_WORKSPACE_NAME = "Default Workspace"
export const STRUCTURED_HARBOR_UPLOADS_V0_BUCKET = "structured-harbor-uploads-v0"
export const WORKSPACE_ROLE = {
    MEMBER: 'member',
    ADMIN: 'admin'
}
export const INVITATION_STATUS = {
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    EXPIRED: 'expired'
}
// invitation status color map
export const INVITATION_STATUS_COLOR_MAP = {
    [INVITATION_STATUS.PENDING]: 'blue',
    [INVITATION_STATUS.ACCEPTED]: 'green',
    [INVITATION_STATUS.REJECTED]: 'red',
    [INVITATION_STATUS.EXPIRED]: 'gray'
}

export const INVITATION_EMAIL_FROM = "Structured Labs <hello@structuredlabs.io>"
export const NEW_THREAD_CONVERSATION_NAME = "New Thread"

export const FILE_SOURCE_TYPE = {
    JOIN: 'join',
    ENTITY_TYPE_GEN: 'entityTypeGen',
}