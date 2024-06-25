import ModalButtons from "components/modal/ModalButtons";
import { ModalWrapper } from "components/modal/ModalWrapper";
import useCreateWorkspace from "hooks/settings/useCreateWorkspace";
import React, { useState } from "react";

interface WorkspaceCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const WorkspaceCreationModal: React.FC<WorkspaceCreationModalProps> = ({
    isOpen,
    onClose,
}) => {

    const [workspaceName, setWorkspaceName] = React.useState('');
    const { createNewWorkspace, isCreateNewWorkspaceLoading,
    } = useCreateWorkspace();

    const handleSubmit = async () => {
        if (workspaceName) {
            await createNewWorkspace(workspaceName);
            setWorkspaceName('');
            onClose();
        }
    }
    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            title=""
            className="w-"
        >
            <div className="space-y-12 w-full p-5 pb-0">
                <div className="pb-12 w-full justify-center">
                    <h2 className="text-xl font-semibold leading-7 text-gray-900 text-center">Create workspace</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600 text-center">
                        Workspaces are shared environments where teams can connect to data sources, run queries and create reports.
                    </p>

                    <div className="mt-10 w-full">
                        <div className="sm:col-span-4 w-full">
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900" aria-required>
                                Name
                            </label>
                            <div className="mt-2 w-full">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 w-full">
                                    <input
                                        type="text"
                                        name="workspaceName"
                                        id="workspaceName"
                                        value={workspaceName}
                                        onChange={(e) => setWorkspaceName(e.target.value)}
                                        autoComplete="off"
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 w-full"
                                        placeholder="My workspace"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalButtons
                connectBtnText="Save"
                onClose={onClose}
                handleConnect={handleSubmit}
                loading={isCreateNewWorkspaceLoading}
            />
        </ModalWrapper>
    );
}

export default WorkspaceCreationModal;