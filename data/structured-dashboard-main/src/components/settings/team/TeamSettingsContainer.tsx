import WorkspaceCreationModal from 'components/sidebar/components/WorkspaceCreationModal';
import useQueriesConversation from 'hooks/queries/useQueriesConversation';
import useReports from 'hooks/reports/useReports';
import useCreateWorkspace from 'hooks/settings/useCreateWorkspace';
import useDeleteAllUserDataSources from 'hooks/settings/useDeleteAllUserDataSources';
import useEditWorkspaceDetails from 'hooks/settings/useEditWorkspaceDetails';
import useUpdateLLMModel from 'hooks/settings/useUpdateLLMModel';
import useDisclosure from 'hooks/useDisclosure';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { DEFAULT_WORKSPACE_NAME } from 'utils/constants';
import { useAuthStore } from 'zustand/auth/authStore';
import { useConfirmationMessageStore } from '../../../zustand/confirmationMessage/confirmationMessageStore';
import { useQueriesState } from '../../../zustand/queries/queriesStore';
import { useWorkspaceStore } from '../../../zustand/workspaces/workspaceStore';
import InviteMemberModal from './InviteMemberModal';
import WorkspaceMembersTable from './WorkspaceMembersTable';

const WorkspaceLogoUpload = () => {
  const { currentWorkspace } = useWorkspaceStore();
  const [logo, setLogo] = useState(currentWorkspace?.WorkspaceLogo || null);
  const { editWorkspaceDetails, isEditWorkspaceLoading } =
    useEditWorkspaceDetails();

  console.log('________________________________');
  console.log('currentWorkspace', currentWorkspace);
  console.log('________________________________');

  const handleLogoUpload = async (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setLogo(reader.result as string);
        await editWorkspaceDetails({
          ...currentWorkspace,
          WorkspaceLogo: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white px-4 py-5 shadow sm:rounded-md sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Workspace Logo
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload your workspace logo.
          </p>
        </div>
        <div className="mt-5 md:col-span-2 md:mt-0">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {logo ? (
                <img
                  className="h-full w-full object-cover"
                  src={logo}
                  alt="Workspace logo"
                />
              ) : (
                <svg
                  className="h-6 w-6 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>
            <div className="ml-4">
              <label
                htmlFor="logo"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Upload logo
              </label>
              <input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="sr-only"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function CreateNewWorkspace() {
  const { currentWorkspace } = useWorkspaceStore();
  const [workspaceName, setWorkspaceName] = React.useState(
    currentWorkspace?.WorkspaceName || '',
  );
  const { editWorkspaceDetails, isEditWorkspaceLoading } =
    useEditWorkspaceDetails();
  const handleSubmit = async (e: any) => {
    e?.preventDefault();
    if (workspaceName) {
      await editWorkspaceDetails({
        ...currentWorkspace,
        WorkspaceName: workspaceName,
      });
    }
  };
  useEffect(() => {
    setWorkspaceName(currentWorkspace?.WorkspaceName || '');
  }, [currentWorkspace?.WorkspaceID]);
  const disableInputs =
    isEditWorkspaceLoading || workspaceName == DEFAULT_WORKSPACE_NAME;
  const personalWorkspace =
    currentWorkspace?.WorkspaceName == DEFAULT_WORKSPACE_NAME;
  return (
    <form className="">
      <div className="space-y-12">
        <div className="pb-12">
          <div className="border-b border-gray-200 bg-white py-5">
            <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
              <div className="ml-4 mt-4">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  {personalWorkspace
                    ? 'My Personal Workspace'
                    : 'Edit workspace'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {personalWorkspace
                    ? 'A dedicated space for your individual data sources, queries, reports and tasks.'
                    : 'Change the settings for your current workspace here.'}
                </p>
              </div>
              {!personalWorkspace && (
                <div className="ml-4 mt-4 flex-shrink-0">
                  <button
                    className={`rounded-md ${
                      isEditWorkspaceLoading
                        ? 'bg-blue-900 text-neutral-200'
                        : 'bg-blue-600 text-white'
                    }  px-3 py-2 text-sm font-semibold  shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}
                    onClick={handleSubmit}
                    disabled={isEditWorkspaceLoading}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
                aria-required
              >
                Name
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                  <input
                    type="text"
                    name="workspaceName"
                    id="workspaceName"
                    value={workspaceName}
                    disabled={disableInputs}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    autoComplete="off"
                    className={`block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 ${
                      disableInputs
                        ? 'bg-neutral-100 text-neutral-500'
                        : 'focus:ring-blue-500'
                    }`}
                    placeholder="My workspace"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

const TeamSettingsContainer = () => {
  const { user } = useAuthStore();
  const { currentWorkspace } = useWorkspaceStore();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const isPersonalWorkspace =
    currentWorkspace?.WorkspaceName == DEFAULT_WORKSPACE_NAME;
  const { newInvitations } = useWorkspaceStore();
  return (
    <div className="p-5">
      <ul role="list" className="space-y-3">
        <li className="overflow-hidden bg-white px-4 py-4 shadow sm:rounded-md sm:px-6">
          <CreateNewWorkspace />
        </li>

        <InviteMemberModal isOpen={isOpen} onClose={onClose} />
        {!isPersonalWorkspace && (
          <li className="overflow-hidden bg-white px-4 py-4 shadow sm:rounded-md sm:px-6">
            <WorkspaceMembersTable openInviteMemberModal={onOpen} />
          </li>
        )}

        <WorkspaceLogoUpload />

        {isPersonalWorkspace && (
          <li className="overflow-hidden bg-white px-4 py-4 shadow sm:rounded-md sm:px-6">
            <CreateWorkspaceCardHeading />
          </li>
        )}
        {newInvitations && newInvitations.length > 0 && (
          <li className="overflow-hidden bg-white px-4 py-4 shadow sm:rounded-md sm:px-6">
            <PendingInvitationsTable />
          </li>
        )}
        <LLMSelectionCard />
        {currentWorkspace?.isCurrentUserAdmin && (
          <li className="overflow-hidden bg-white px-4 py-4 shadow rounded-md sm:px-6 border border-red-400">
            <DangerZone />
          </li>
        )}
      </ul>
    </div>
  );
};

function LLMSelectionCard() {
  const { updateLLMModel, isLoading, error } = useUpdateLLMModel();

  const { setLlmModel, llmModel } = useQueriesState();

  const handleLLMChange = async (llm: string) => {
    setLlmModel(llm);
    await updateLLMModel(llm);
  };

  return (
    <li className="overflow-hidden bg-white px-4 py-4 shadow sm:rounded-md sm:px-6">
      <div className="bg-white py-5">
        <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-4">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              LLMs
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Select the language model to use for generating insights.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex space-x-4">
          <div
            className={`cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
              llmModel === 'gpt-3.5-turbo'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700'
            }`}
            onClick={() => handleLLMChange('gpt-3.5-turbo')}
          >
            GPT 3.5 Turbo
          </div>
          <div
            className={`cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${
              llmModel === 'gpt-4-1106-preview'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700'
            }`}
            onClick={() => handleLLMChange('gpt-4-1106-preview')}
          >
            GPT 4 Turbo
          </div>
        </div>
      </div>
    </li>
  );
}

const CreateWorkspaceCardHeading = () => {
  const {
    isOpen: isWorkspaceCreationModalOpen,
    onOpen: onWorkspaceCreationModalOpen,
    onClose: onWorkspaceCreationModalClose,
  } = useDisclosure();
  return (
    <>
      <div className="bg-white py-5">
        <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-4">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Create shared workspaces
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create a shared workspace to collaborate with your team on data
              sources, queries, reports and blocks.
            </p>
          </div>
          <div className="ml-4 mt-4 flex-shrink-0">
            <button
              type="button"
              className="relative inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 gap-x-2"
              onClick={() => onWorkspaceCreationModalOpen()}
            >
              <FaPlus />
              <span className="font-semibold">Create Workspace</span>
            </button>
          </div>
        </div>
      </div>
      <WorkspaceCreationModal
        isOpen={isWorkspaceCreationModalOpen}
        onClose={onWorkspaceCreationModalClose}
      />
    </>
  );
};

function PendingInvitationsTable() {
  const { newInvitations, setNewInvitations } = useWorkspaceStore();
  const { addNewMemberToWorkspace, declineInvitation } = useCreateWorkspace();

  const handleAddNewMemberToWorkspace = async (
    workspaceId: string,
    invitationId: string,
  ) => {
    await addNewMemberToWorkspace(workspaceId, invitationId);
    const updatedInvitations = newInvitations.filter(
      (invitation) => invitation.InvitationID !== invitationId,
    );
    setNewInvitations(updatedInvitations);
  };
  const handleDeclineInvitation = async (invitationId: string) => {
    await declineInvitation(invitationId);
    const updatedInvitations = newInvitations.filter(
      (invitation) => invitation.InvitationID !== invitationId,
    );
    setNewInvitations(updatedInvitations);
  };

  return (
    <div className="">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Invitations
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            You have been invited to join the following workspaces. Accept or
            decline the invitations below.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          {/* <button
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button> */}
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Workspace Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Invited By
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {newInvitations?.map((invitation) => (
                  <tr key={invitation.InvitationID}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {invitation.WorkspaceName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {invitation.InvitationFromEmail}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 flex flex-row gap-x-2">
                      <a
                        // href={project.href}
                        className="cursor-pointer hidden rounded-md bg-accept/90 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-accept hover:bg-accept/100 sm:block"
                        onClick={async () =>
                          handleAddNewMemberToWorkspace(
                            invitation.WorkspaceID,
                            invitation.InvitationID,
                          )
                        }
                      >
                        Accept
                      </a>
                      <a
                        // href={project.href}
                        className="cursor-pointer hidden rounded-md bg-reject/90 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-reject hover:bg-reject/100 sm:block"
                        onClick={async () =>
                          handleDeclineInvitation(invitation.InvitationID)
                        }
                      >
                        Decline
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function DangerZoneOption({
  title,
  subString,
  btnText,
  btnFunc,
  isLoading,
}: {
  title: string;
  subString: string;
  btnText: string;
  btnFunc: () => void;
  isLoading: boolean;
}) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    btnFunc();
  };

  return (
    <li className="flex justify-between gap-x-6 py-5">
      <div className="flex min-w-0 gap-x-4">
        <div className="min-w-0 flex-auto">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {title}
          </p>
          <p className="mt-1 truncate text-xs leading-5 text-gray-500">
            {subString}
          </p>
        </div>
      </div>
      <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
        <button
          type="button"
          onClick={handleClick}
          className="rounded-md bg-gray-100 text-red-500 px-3 py-2 text-sm font-semibold shadow-sm hover:bg-red-500 hover:text-gray-100"
          disabled={isLoading}
        >
          {isLoading ? 'Deleting...' : btnText}
        </button>
      </div>
    </li>
  );
}

function DangerZone() {
  const { deleteAllUserDataSources, isDeleting } =
    useDeleteAllUserDataSources();

  const handleDeleteAll = async () => {
    await deleteAllUserDataSources();
  };
  const { deleteAllConversations, deleting } = useQueriesConversation();

  const { deleteAllReports, isLoading: isLoadingDeleteAllReports } =
    useReports();
  const { setConfirmationMessage } = useConfirmationMessageStore();

  return (
    <ul role="list" className="divide-y divide-red-300">
      <DangerZoneOption
        title="Disconnect All Data Sources"
        subString="All data sources present in the harbor will be disconnected. This action is not reversible. We dont store any data from the data sources."
        btnText="Disconnect"
        btnFunc={() =>
          setConfirmationMessage(
            'Disconnect All Data Sources',
            'Are you sure you want to disconnect all data sources? This action cannot be undone.',
            async () => handleDeleteAll(),
            isDeleting,
          )
        }
        isLoading={false}
      />

      <DangerZoneOption
        title="Clear All Query Threads"
        subString="All queries will be deleted. This action is not reversible."
        btnText="Clear"
        btnFunc={() =>
          setConfirmationMessage(
            'Clear All Queries',
            'Are you sure you want to clear all queries? This action cannot be undone.',
            async () => await deleteAllConversations(),
            deleting,
          )
        }
        isLoading={deleting}
      />

      <DangerZoneOption
        title="Clear All Saved Reports"
        subString="All reports will be deleted. This action is not reversible."
        btnText="Clear"
        btnFunc={() =>
          setConfirmationMessage(
            'Clear All Reports',
            'Are you sure you want to clear all reports? This action cannot be undone.',
            async () => await deleteAllReports(),
            isLoadingDeleteAllReports,
          )
        }
        isLoading={isLoadingDeleteAllReports}
      />
    </ul>
  );
}

export default TeamSettingsContainer;
