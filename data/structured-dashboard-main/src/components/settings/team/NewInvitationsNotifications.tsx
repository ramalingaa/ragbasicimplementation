import { Fragment, useState } from 'react'
import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { Invitation, useWorkspaceStore } from '../../../zustand/workspaces/workspaceStore';
import useCreateWorkspace from 'hooks/settings/useCreateWorkspace';
import useSetupWorkspace from 'hooks/workspace/useSetupWorkspace';

export default function NewInvitationsNotifications() {
  const [show, setShow] = useState(true)

  const { newInvitations, setNewInvitations } = useWorkspaceStore();
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

  const [showInvitations, setShowInvitations] = useState(
    newInvitations.reduce((acc, invitation) => {
      acc[invitation.InvitationID] = true
      return acc
    }, {} as { [key: string]: boolean })
  )
  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div
        aria-live="assertive"
        className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-10 flex-col gap-y-2"
      >
        {
          newInvitations.map((invitation) => (
            <InvitationComponent
              key={invitation.InvitationID}
              invitation={invitation}
              addNewMemberToWorkspace={() => handleAddNewMemberToWorkspace(invitation.WorkspaceID, invitation.InvitationID)}
              handleDeclineInvitation={() => handleDeclineInvitation(invitation.InvitationID)}
              show={showInvitations[invitation.InvitationID]}
              close={
                () => {
                  setShowInvitations({
                    ...showInvitations,
                    [invitation.InvitationID]: false
                  })
                }
              }
            />
          ))
        }
      </div>
    </>
  )
}

function InvitationComponent(
  {
    invitation,
    show,
    close,
    addNewMemberToWorkspace,
    handleDeclineInvitation,
  }: {
    invitation: Invitation
    show: boolean
    close: () => void
    addNewMemberToWorkspace: () => void
    handleDeclineInvitation: () => void
  }
) {
  return (
    <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
      {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
      <Transition
        show={show === true}
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="pointer-events-auto w-full max-w-sm rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-4">
            <div className="flex items-start">
              {/* <div className="flex-shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                  alt=""
                />
              </div> */}
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{invitation.WorkspaceName}</p>
                <p className="mt-1 text-sm text-gray-500">Invitation to join workspace.</p>
                <div className="mt-4 flex">
                  <button
                    type="button"
                    className="cursor-pointer hidden rounded-md bg-accept/90 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-accept hover:bg-accept/100 sm:block"
                    onClick={() => addNewMemberToWorkspace()}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="ml-3 inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => handleDeclineInvitation()}
                  >
                    Decline
                  </button>
                </div>
              </div>
              <div className="ml-4 flex flex-shrink-0">
                <button
                  type="button"
                  className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => {
                    close()
                  }}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  )
}