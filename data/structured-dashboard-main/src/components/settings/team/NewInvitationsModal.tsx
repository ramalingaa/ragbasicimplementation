import { ModalWrapper } from "components/modal/ModalWrapper";
import React from 'react';
import { Invitation } from "../../../zustand/workspaces/workspaceStore";
import { useWorkspaceStore } from "../../../zustand/workspaces/workspaceStore";
import useCreateWorkspace from "hooks/settings/useCreateWorkspace";
import useSetupWorkspace from "hooks/workspace/useSetupWorkspace";

interface InvitationProps {
    invitation: Invitation;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

function InvitationComponent({ invitation, addNewMemberToWorkspace, handleDeclineInvitation }: { invitation: Invitation, addNewMemberToWorkspace: () => void, handleDeclineInvitation: () => void }) {
    const {
        WorkspaceRole,
        WorkspaceID,
        ExpirationDate,
        Status,
        InvitationID,
        InvitedBy,
        Email,
        CreatedAt,
        WorkspaceName,
    } = invitation;
    return (
        <ul role="list" className="divide-y divide-gray-100">
            <li key={InvitationID} className="flex items-center justify-between gap-x-6 py-5">
                <div className="min-w-0">
                    <div className="flex items-start gap-x-3">
                        <p className="text-sm font-semibold leading-6 text-gray-900">{WorkspaceName}</p>
                        <p
                            className={classNames(
                                'text-gray-600 bg-gray-50 ring-gray-500/10',
                                'rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset'
                            )}
                        >
                            {Status}
                        </p>
                    </div>
                    <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                        <p className="whitespace-nowrap">
                            {/* Due on <time dateTime={ExpirationDate}>{ExpirationDate}</time> */}
                        </p>
                        {/* <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                            <circle cx={1} cy={1} r={1} />
                        </svg> */}
                        {/* <p className="truncate">Created by {InvitedBy}</p> */}
                    </div>
                </div>
                <div className="flex flex-none items-center gap-x-4">
                    <a
                        // href={project.href}
                        className="cursor-pointer hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                        onClick={() => addNewMemberToWorkspace()}
                    >
                        Accept
                    </a>
                    <a
                        // href={project.href}
                        className="cursor-pointer hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block"
                        onClick={() => handleDeclineInvitation()}
                    >
                        Decline
                    </a>
                </div>
            </li>
        </ul>
    )
}


interface NewInvitationsModalProps {
    isOpen: boolean;
    onClose: () => void;
}
const NewInvitationsModal: React.FC<NewInvitationsModalProps> = ({
    isOpen,
    onClose,
}) => {
    const { newInvitations, setNewInvitations } = useWorkspaceStore();
    console.log({ newInvitations })
    const { addNewMemberToWorkspace, declineInvitation } = useCreateWorkspace();
    const { onNewInvitationsModalClose } = useSetupWorkspace();
    const handleAddNewMemberToWorkspace = async (workspaceId: string, invitationId: string) => {
        await addNewMemberToWorkspace(workspaceId, invitationId);
        const updatedInvitations = newInvitations.filter((invitation) => invitation.InvitationID !== invitationId);
        setNewInvitations(updatedInvitations);
        if (updatedInvitations.length === 0) {
            onNewInvitationsModalClose();
        }
    }
    const handleDeclineInvitation = async (invitationId: string) => {
        await declineInvitation(invitationId);
        const updatedInvitations = newInvitations.filter((invitation) => invitation.InvitationID !== invitationId);
        setNewInvitations(updatedInvitations);
        if (updatedInvitations.length === 0) {
            onNewInvitationsModalClose();
        }
    }
    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title={'New Invitations'}
            className="w-"
        >
            {
                newInvitations?.map((invitation) => (
                    <InvitationComponent
                        key={invitation.InvitationID}
                        invitation={invitation}
                        addNewMemberToWorkspace={() => handleAddNewMemberToWorkspace(invitation.WorkspaceID, invitation.InvitationID)}
                        handleDeclineInvitation={() => handleDeclineInvitation(invitation.InvitationID)}
                    />
                ))
            }
        </ModalWrapper>

    )
};

export default NewInvitationsModal;