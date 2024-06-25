import { useState } from 'react'
import { Listbox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import useEditWorkspaceDetails from 'hooks/settings/useEditWorkspaceDetails';
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'
import useSetupWorkspace from 'hooks/workspace/useSetupWorkspace';
import { Workspace, useWorkspaceStore } from '../../../zustand/workspaces/workspaceStore';
import { WorkspaceMember } from '../../../zustand/workspaces/workspaceStore';
import { useAuthStore } from 'zustand/auth/authStore';
import { ReactNode, useEffect } from 'react';
import { DEFAULT_WORKSPACE_NAME, INVITATION_STATUS, INVITATION_STATUS_COLOR_MAP, WORKSPACE_ROLE } from 'utils/constants';
import useRefreshTrigger from 'hooks/refreshTrigger';
import Spinner from 'components/spinner/Spinner';
import { useConfirmationMessageStore } from '../../../zustand/confirmationMessage/confirmationMessageStore';

const WorkspaceMembersTable = ({ openInviteMemberModal }: { openInviteMemberModal: () => void }) => {
    const { user } = useAuthStore();
    const { getWorkspaceMembers, isLoading } = useSetupWorkspace();
    const { workspaceMembers, currentWorkspace } = useWorkspaceStore();
    const { deleteCurrentWorkspace, leaveCurrentWorkspace, isEditWorkspaceLoading } = useEditWorkspaceDetails();
    const refreshTrigger = useRefreshTrigger();

    const [inviteMemberBtnDisabled, setInviteMemberBtnDisabled] = useState(

        isLoading || !user || !currentWorkspace || currentWorkspace && currentWorkspace.WorkspaceName == DEFAULT_WORKSPACE_NAME || currentWorkspace && !currentWorkspace.isCurrentUserAdmin || (currentWorkspace && currentWorkspace.Members.filter((member: WorkspaceMember) => member.userId === user?.sub).length == 1 && currentWorkspace.Members.filter((member: any) => member.role === 'admin').length > 1))
    useEffect(() => {
        async function init() {
            console.log("fetching workspace members")
            await getWorkspaceMembers();
        }
        init();
    }, [currentWorkspace?.WorkspaceID, refreshTrigger, user?.sub]);

    useEffect(() => {
        setInviteMemberBtnDisabled(isLoading || !user || !currentWorkspace || currentWorkspace && currentWorkspace.WorkspaceName == DEFAULT_WORKSPACE_NAME || currentWorkspace && !currentWorkspace.isCurrentUserAdmin || (currentWorkspace && currentWorkspace.Members.filter((member: WorkspaceMember) => member.userId === user?.sub).length == 1 && currentWorkspace.Members.filter((member: any) => member.role === 'admin').length > 1))

        console.log(isLoading, !user?.sub, !currentWorkspace, currentWorkspace.WorkspaceName == DEFAULT_WORKSPACE_NAME, !currentWorkspace.isCurrentUserAdmin, (currentWorkspace && currentWorkspace.Members.filter((member: WorkspaceMember) => member.userId === user?.sub).length == 1 && currentWorkspace.Members.filter((member: any) => member.role === 'admin').length > 1))
    }, [isLoading, !user?.sub, !currentWorkspace, currentWorkspace && currentWorkspace.WorkspaceName == DEFAULT_WORKSPACE_NAME, currentWorkspace && currentWorkspace]);

    const Tag = ({ children, className }: { children: ReactNode, className: string }) => {
        return (
            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${className}`}>
                {children}
            </span>
        )
    }
    const { setConfirmationMessage } = useConfirmationMessageStore();
    return (
        <div className="">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-base font-semibold leading-6 text-gray-900">Team</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Collaborate on Blocks, Queries, Reports and Harbor with your team!
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-x-4">
                    <button
                        type="button"
                        className={`block rounded-md text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                        text-red-btn-bg cursor-pointer bg-white hover:bg-red-btn-bg border-red-btn-bg border-[1px] border-md mr-2 transition duration-300 ease-in-out
                        hover:text-white px-3 py-1 text-sm font-semibold shadow-sm h-8 max-w-fit`}
                        onClick={async () => { await leaveCurrentWorkspace() }}
                    >
                        Leave Workspace
                    </button>
                    <button
                        type="button"
                        className={`relative group block rounded-md text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 border-[1px] border-md mr-2 transition duration-300 ease-in-out hover:text-white px-3 py-1 text-sm font-semibold shadow-sm h-8 max-w-fit ${inviteMemberBtnDisabled ? 'bg-gray-600 text-gray-200 cursor-not-allowed' : 'text-red-btn-bg cursor-pointer bg-white hover:bg-red-btn-bg border-red-btn-bg'}`}
                        onClick={async () => {
                            setConfirmationMessage(
                                "Delete Data Source",
                                "Are you sure you want to delete the selected data source? This action cannot be undone.",
                                async () => await deleteCurrentWorkspace(),
                                isEditWorkspaceLoading
                            )
                        }}
                        disabled={inviteMemberBtnDisabled}
                    >
                        Delete Workspace
                        {inviteMemberBtnDisabled && currentWorkspace && currentWorkspace.Members.filter((member: WorkspaceMember) => member.userId === user?.sub).length == 1 && currentWorkspace.Members.filter((member: any) => member.role === 'admin').length > 1 &&
                            <div className="font-normal text-wrap max-w-6 whitespace-pre-wrap absolute mt-1 top-full -ml-3 hidden min-w-max rounded-md bg-black px-3 py-1 text-sm text-white group-hover:block">
                                There are other admins in the workspace.
                            </div>}
                    </button>
                    <button
                        type="button"
                        className={`block rounded-md text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
                        px-3 py-1 text-sm font-semibold shadow-sm h-8 max-w-fit ${inviteMemberBtnDisabled ? 'bg-gray-600 text-gray-200 cursor-not-allowed' : 'text-white bg-blue-500 border border-md border-blue-500 cursor-pointer hover:bg-blue-btn-hover hover:text-white'}`}
                        onClick={() => { openInviteMemberModal() }}
                        disabled={inviteMemberBtnDisabled}
                    >
                        Invite Teammate
                    </button>
                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -mt-2 sm:-mx-6 lg:-mx-8 h-[calc(100% + 4rem)]">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        {
                            isLoading ? <div className='my-4 w-full flex items-center justify-center'>
                                <Spinner className="h-5 w-5 border-2" />
                            </div>
                                :
                                <table className="min-w-full divide-y divide-gray-300 mb-24">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs text-gray-600 sm:pl-0">
                                                USER
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-xs text-gray-600">
                                                ACCESS LEVEL
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-xs text-gray-600">
                                                STATUS
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                                <span className="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y divide-gray-200 bg-white`}>
                                        {
                                            workspaceMembers?.filter((person: WorkspaceMember) => person.invitationStatus != INVITATION_STATUS.ACCEPTED)
                                                .map((person: WorkspaceMember) => (
                                                    <tr key={person.userId}>
                                                        <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                                            <div className="flex items-center">
                                                                {person?.image &&
                                                                    <div className="h-11 w-11 flex-shrink-0">
                                                                        <img className="h-11 w-11 rounded-full" src={person?.image} alt="" />
                                                                    </div>
                                                                }
                                                                <div className={`${person?.image && "ml-4"}`}>
                                                                    <div className="font-medium text-gray-900">{person?.name || "Structured User"}</div>
                                                                    <div className="mt-1 text-gray-500">{person.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                            {
                                                                currentWorkspace?.isCurrentUserAdmin && ![INVITATION_STATUS.PENDING, INVITATION_STATUS.REJECTED, INVITATION_STATUS.EXPIRED].includes(person?.invitationStatus)

                                                                    // only single admin
                                                                    // && currentWorkspace?.Members.filter((member: WorkspaceMember) => (member.role == WORKSPACE_ROLE.ADMIN)).length != 1 && currentWorkspace?.Members.filter((member: WorkspaceMember) => (member.role == WORKSPACE_ROLE.ADMIN && member.email == person.email)).length == 1 

                                                                    ?
                                                                    <MemberRoleDropdownForAdmin role={person.role} userId={person.userId} />
                                                                    :
                                                                    <Tag className='bg-blue-100 text-blue-700'>
                                                                        {person.role || currentWorkspace?.WorkspaceName == DEFAULT_WORKSPACE_NAME && 'Admin'}
                                                                    </Tag>
                                                            }
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                                            {
                                                                [INVITATION_STATUS.PENDING, INVITATION_STATUS.REJECTED, INVITATION_STATUS.EXPIRED].includes(person?.invitationStatus) ?
                                                                    <button>
                                                                        {/*  use INVITATION_STATUS_COLOR_MAP to color the tag */}
                                                                        <Tag className={`bg-${INVITATION_STATUS_COLOR_MAP[person?.invitationStatus]}-100 text-${INVITATION_STATUS_COLOR_MAP[person?.invitationStatus]}-700`}>
                                                                            {person.invitationStatus}
                                                                        </Tag>
                                                                    </button>
                                                                    :
                                                                    <button>
                                                                        <Tag className='bg-green-100 text-green-700'>
                                                                            Live
                                                                        </Tag>
                                                                    </button>
                                                            }
                                                        </td>
                                                        <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                            <div className='flex flex-row items-center gap-x-2 justify-end'>
                                                                {currentWorkspace?.WorkspaceName != DEFAULT_WORKSPACE_NAME
                                                                    &&
                                                                    <KebabMenu
                                                                        person={person}
                                                                        isCurrentUserAdmin={currentWorkspace ? currentWorkspace?.isCurrentUserAdmin : false}
                                                                    />
                                                                }
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                    </tbody>
                                </table>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

function KebabMenu({ person, isCurrentUserAdmin }: { person?: WorkspaceMember, isCurrentUserAdmin: boolean }) {
    const { user } = useAuthStore();
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="flex items-center rounded-full text-gray-400 hover:text-gray-600 focus:outline-none">
                    <span className="sr-only">Open options</span>
                    <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        {isCurrentUserAdmin &&
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        <RemoveMemberBtn workspaceMember={person} isPendingMember={
                                            person?.invitationID != ""
                                        } />
                                    </a>
                                )}
                            </Menu.Item>
                        }
                        {
                            (person?.invitationStatus == INVITATION_STATUS.PENDING || person?.invitationStatus == INVITATION_STATUS.REJECTED || person?.invitationStatus == INVITATION_STATUS.EXPIRED) &&
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        Resend Invitation
                                    </a>
                                )}
                            </Menu.Item>
                        }
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}

function RemoveMemberBtn({ workspaceMember, isPendingMember }: { workspaceMember: WorkspaceMember, isPendingMember?: boolean }) {

    const { removePendingInviteToMember, removeWorkspaceMember } = useEditWorkspaceDetails();
    return (
        <button
            className='w-full h-full text-start'
            onClick={async () => {
                if (workspaceMember.invitationStatus == INVITATION_STATUS.PENDING) {
                    await removePendingInviteToMember(workspaceMember?.invitationID)
                } else {
                    await removeWorkspaceMember(workspaceMember.userId)
                }
            }}
        >
            {workspaceMember.invitationStatus == INVITATION_STATUS.PENDING
                ? "Delete Invitation" : "Remove member"
            }
        </button>
    )
}

function MemberRoleDropdownForAdmin(
    {
        role,
        userId,
    }: {
        role: string,
        userId: string,
    }
) {
    const [selected, setSelected] = useState(role)
    const roles = [WORKSPACE_ROLE.MEMBER, WORKSPACE_ROLE.ADMIN]
    const { handleRoleChange } = useEditWorkspaceDetails();
    const handleRoleChangeLocal = async (newVal: string) => {
        const success = await handleRoleChange(userId, newVal);
        if (success) {
            setSelected(newVal);
        }
    }
    return (
        <Listbox value={selected} onChange={async (newVal) => await handleRoleChangeLocal(newVal)}>
            {({ open }) => (
                <>
                    {/* <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Assigned to</Listbox.Label> */}
                    <div className="relative mt-2 w-28">
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6">
                            <span className="block truncate capitalize">{selected}</span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {roles.map((roleLocal) => (
                                    <Listbox.Option
                                        key={roleLocal}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'bg-blue-600 text-white' : 'text-gray-900',
                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                            )
                                        }
                                        value={roleLocal}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate capitalize')}>
                                                    {roleLocal}
                                                </span>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active ? 'text-white' : 'text-blue-600',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                        )}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    )
}

export default WorkspaceMembersTable;