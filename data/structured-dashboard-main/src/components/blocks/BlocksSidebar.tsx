// BlocksSidebar.tsx
'use client';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ServerIcon } from '@heroicons/react/20/solid';
import { useBlocksStore } from '../../zustand/blocks/blocksStore';
import { updateBlock } from 'typescript';

export default function BlocksSidebar() {
  const isBlocksSidebarOpen = useBlocksStore(
    (state) => state.isBlocksSidebarOpen,
  );
  const setIsBlocksSidebarOpen = useBlocksStore(
    (state) => state.setIsBlocksSidebarOpen,
  );

  return (
    <BlocksSlideover
      open={isBlocksSidebarOpen}
      setOpen={setIsBlocksSidebarOpen}
    />
  );
}

function BlocksSlideover({ open, setOpen }: { open: boolean; setOpen: any }) {
  const selectedBlockId = useBlocksStore((state) => state.selectedBlockId);

  const triggers = [
    { id: '1', name: 'Record command', icon: ServerIcon, type: 'Records' },
    { id: '2', name: 'Record created', icon: ServerIcon, type: 'Records' },
    { id: '3', name: 'Record updated', icon: ServerIcon, type: 'Records' },
  ];

  const selectTrigger = (triggerId: string) => {
    // Handle trigger selection logic here
    console.log('Selected trigger:', triggerId);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Select Trigger
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-blue-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm text-gray-500">
                          Pick an event to start this workflow
                        </p>
                      </div>
                      <div className="mt-4">
                        <div className="space-y-4">
                          {triggers.map((trigger) => (
                            <div
                              key={trigger.id}
                              className="flex items-center justify-between rounded-lg border border-gray-300 p-1.5 hover:bg-gray-50 cursor-pointer"
                              onClick={() => {}}
                            >
                              <div className="flex items-center">
                                <div className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-4 h-4 text-gray-500"
                                  >
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line
                                      x1="12"
                                      y1="18"
                                      x2="12"
                                      y2="12"
                                    ></line>
                                    <line x1="9" y1="15" x2="15" y2="15"></line>
                                  </svg>
                                </div>
                                <span className="ml-2 text-xs font-medium text-gray-900">
                                  {trigger.name}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
