'use client';

import { Fragment, useEffect, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { useWorkspaceStore } from '../../../zustand/workspaces/workspaceStore';
import { FaPlus } from "react-icons/fa";
import WorkspaceCreationModal from './WorkspaceCreationModal';
import useDisclosure from 'hooks/useDisclosure';
import useRefreshTrigger from 'hooks/refreshTrigger';

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function WorkspaceSelectMenu() {
    const { currentWorkspace, setCurrentWorkspace, availableWorkspaces } = useWorkspaceStore();
    const {
        isOpen: isWorkspaceCreationModalOpen,
        onOpen: onWorkspaceCreationModalOpen,
        onClose: onWorkspaceCreationModalClose,
    } = useDisclosure();

    return (
        <>
            <Listbox value={currentWorkspace} onChange={setCurrentWorkspace}>
                {({ open }) => (
                    <>
                        {/* <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">Select Workspace</Listbox.Label> */}
                        <div className="relative my-2">
                            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6">
                                <div className="inline-flex w-full tracking-tighter truncate  font-normal place-content-center text-[0.875rem] h-full my-auto">
                                    {currentWorkspace ? currentWorkspace?.WorkspaceName : "Loading..."}
                                </div>
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
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm bottom-full mb-2">
                                    <button
                                        key={"create new workspace"}
                                        className={
                                            classNames(
                                                'text-blue-600',
                                                'sticky flex gap-x-3 text-xs cursor-pointer select-none py-2 pl-3 pr-9'
                                            )
                                        }
                                        onClick={() => onWorkspaceCreationModalOpen()}
                                    >
                                        <FaPlus /><span className='font-semibold'>Create Workspace</span>
                                    </button>
                                    {availableWorkspaces.map((workspace) => (
                                        <Listbox.Option
                                            key={workspace.WorkspaceID}
                                            className={({ active }) =>
                                                classNames(
                                                    active ? 'bg-blue-600 text-white' : 'text-gray-900',
                                                    'relative cursor-default select-none py-2 pl-3 pr-9', 'truncate tracking-tighter font-medium place-content-center text-[0.875rem] h-full my-auto'
                                                )
                                            }
                                            value={workspace}
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <div className="flex">
                                                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 
                                                        'truncate tracking-tighter font-medium place-content-center text-[0.875rem] h-full my-auto'
                                                        )}>
                                                            {workspace.WorkspaceName}
                                                        </span>
                                                        {/* <span className={classNames(active ? 'text-blue-200' : 'text-gray-500', 'ml-2 truncate')}>
                                                        {workspace.WorkspaceName}
                                                    </span> */}
                                                    </div>

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
            <WorkspaceCreationModal
                isOpen={isWorkspaceCreationModalOpen}
                onClose={onWorkspaceCreationModalClose}
            /></>
    )
}
