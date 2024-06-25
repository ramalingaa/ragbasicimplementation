import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useSidebarStore } from '../../zustand/app/appStore';

export const ModalWrapper = ({
  isOpen,
  onClose,
  children,
  title,
  className,
  hasCloseButton = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  className?: string;
  hasCloseButton?: boolean;
}) => {
  return (
    <div className="data-view-modal-wrapper">
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel
                  className={`relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 ${
                    className ? className : 'sm:w-full sm:max-w-sm'
                  } sm:p-6`}
                >
                  <div className="absolute right-0 top-0 pr-4 pt-4 block">
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={() => onClose()}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    {hasCloseButton && (
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={onClose}
                      >
                        <span className="sr-only">Close</span>
                        <svg
                          className="h-6 w-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
};

import { FaDownload } from 'react-icons/fa';
import { useQueriesState } from '../../zustand/queries/queriesStore';
import useFetchQueriesHistory from 'hooks/queries/useFetchQueriesHistory';

export const DataViewModalWrapper = ({
  isOpen,
  onClose,
  children,
  title,
  className,
  showTitle = true,
  onSave,
  showSaveButton,
  showLuckyButton,
  onLucky,
  showDownloadPDFButton,
  onDownloadPDF,
  showCreateButton,
  onCreate,
  showAddTileButton,
  onAddChart,
  onAddTextBox,
  showBlockBuildButton,
  onBlockBuild,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  className?: string;
  showTitle?: boolean;
  onSave?: () => void;
  showSaveButton?: boolean;
  showLuckyButton?: boolean;
  onLucky?: () => void;
  showDownloadPDFButton?: boolean;
  onDownloadPDF?: () => void;
  showCreateButton?: boolean;
  onCreate?: () => void;
  showAddTileButton?: boolean;
  onAddChart?: () => void;
  onAddTextBox?: () => void;
  showBlockBuildButton?: boolean;
  onBlockBuild?: () => void;
}) => {
  const { isLoading } = useFetchQueriesHistory();
  const { queryConversationHistory } = useQueriesState();
  const [isAddTileOpen, setIsAddTileOpen] = useState(false);

  const handleAddTileClick = () => {
    setIsAddTileOpen((prevOpen) => !prevOpen);
  };

  const handleAddChartClick = () => {
    if (onAddChart) {
      onAddChart();
      setIsAddTileOpen(false);
    }
  };

  const handleAddTextBoxClick = () => {
    if (onAddTextBox) {
      onAddTextBox();
      setIsAddTileOpen(false);
    }
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsAddTileOpen(false);
    }
  };

  useEffect(() => {
    if (isAddTileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAddTileOpen]);

  const sidebarOpen = useSidebarStore((state) => state.isSidebarOpen);
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div
          className={`fixed inset-0 z-10 overflow-y-auto justify-self-end h-full content-center ${
            sidebarOpen
              ? 'w-lvw lg:w-[calc(100vw-17.188rem)]'
              : 'w-lvw lg:w-[calc(100vw - 4rem)]'
          }`}
        >
          <div
            className={`flex items-end justify-center p-4 text-center sm:items-center sm:p-0 h-[95vh] ${
              !sidebarOpen && 'lg:ml-[4rem]'
            }`}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={`border border-gray-300 h-full relative transform overflow-hidden rounded-lg bg-white ${
                  showDownloadPDFButton ? 'px-0' : 'px-4'
                } pb-4 pt-5 text-left transition-all sm:my-8 ${
                  className ? className : 'sm:w-full sm:max-w-sm'
                } ${
                  showDownloadPDFButton ? 'sm:p-0' : 'sm:p-6'
                } overflow-y-scroll`}
                style={{
                  width: '95vw',
                }}
              >
                <div className="absolute right-0 top-0 pr-4 pt-4 block flex items-center">
                  {showBlockBuildButton && onBlockBuild && (
                    <button
                      onClick={onBlockBuild}
                      className="max-w-fit inline-flex w-full items-center text-white justify-center gap-x-1.5 rounded-md bg-blue-500 px-3 py-1 text-sm font-semibold shadow-sm hover:bg-[#2064e4] border border-blue-500 h-8 mr-4"
                    >
                      Build
                    </button>
                  )}
                  {showLuckyButton && onLucky && (
                    <button
                      onClick={onLucky}
                      className="max-w-fit inline-flex w-full items-center text-white justify-center gap-x-1.5 rounded-md bg-blue-500 px-3 py-1 text-sm font-semibold shadow-sm hover:bg-[#2064e4] border border-blue-500 h-8 mr-4"
                    >
                      I'm feeling lucky
                    </button>
                  )}
                  {showSaveButton && onSave && (
                    <button
                      onClick={onSave}
                      className="max-w-fit inline-flex w-full items-center text-white justify-center gap-x-1.5 rounded-md bg-blue-500 px-3 py-1 text-sm font-semibold shadow-sm hover:bg-[#2064e4] border border-blue-500 h-8 mr-4"
                    >
                      Save
                    </button>
                  )}
                  {showDownloadPDFButton && onDownloadPDF && (
                    <button
                      onClick={onDownloadPDF}
                      className="max-w-fit inline-flex w-full items-center text-white justify-center gap-x-1.5 rounded-md bg-blue-500 px-3 py-1 text-sm font-semibold shadow-sm hover:bg-[#2064e4] border border-blue-500 h-8 mr-4"
                    >
                      <FaDownload className="mr-2" />
                      Download
                    </button>
                  )}
                  {showCreateButton && onCreate && (
                    <button
                      onClick={onCreate}
                      className="max-w-fit inline-flex w-full items-center text-white justify-center gap-x-1.5 rounded-md bg-blue-500 px-3 py-1 text-sm font-semibold shadow-sm hover:bg-[#2064e4] border border-blue-500 h-8 mr-4"
                    >
                      Create
                    </button>
                  )}
                  {showAddTileButton && (onAddChart || onAddTextBox) && (
                    <div
                      ref={dropdownRef}
                      className="relative inline-block text-left z-10"
                    >
                      <button
                        onClick={handleAddTileClick}
                        className="max-w-fit inline-flex w-full items-center text-white justify-center gap-x-1.5 rounded-md bg-blue-500 px-3 py-1 text-sm font-semibold shadow-sm hover:bg-[#2064e4] border border-blue-500 h-8 mr-4"
                      >
                        Add Tile
                      </button>
                      {isAddTileOpen && (
                        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                            aria-labelledby="options-menu"
                          >
                            <button
                              onClick={handleAddChartClick}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              role="menuitem"
                            >
                              Add Chart
                            </button>
                            <button
                              onClick={handleAddTextBoxClick}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              role="menuitem"
                            >
                              Add Text Box
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {!showDownloadPDFButton && (
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={() => onClose()}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  )}
                </div>
                {showTitle && (
                  <div
                    className={`${
                      showDownloadPDFButton
                        ? 'bg-gray-100 px-6 py-4'
                        : 'px-4 pt-4'
                    }`}
                  >
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {showDownloadPDFButton ? 'Export Preview' : title}
                    </Dialog.Title>
                  </div>
                )}
                {showDownloadPDFButton && (
                  <div className="border-b border-gray-200 w-full" />
                )}
                <div
                  className={`${
                    showDownloadPDFButton ? 'px-6 py-4' : 'px-4 py-4'
                  }`}
                >
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
