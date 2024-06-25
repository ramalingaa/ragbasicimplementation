import React from 'react';
import { BsFileEarmarkSpreadsheetFill } from 'react-icons/bs';
import { FaFileCsv, FaPlus, FaQuestionCircle } from 'react-icons/fa';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import useFetchDataSources from 'hooks/harbor/useFetchDataSources';
import { ModalWrapper } from 'components/modal/ModalWrapper';
import ModalButtons from 'components/modal/ModalButtons';
import { Menu } from '@headlessui/react';

interface QueriesCustomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QueriesCustomModal: React.FC<QueriesCustomModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    dataSources,
    setQueriesChosenDataSource,
    queriesChosenDataSource,
    setReportsChosenDataSource,
  } = useHarborStore();
  const { errorMessage, isLoading } = useFetchDataSources();

  const handleDataSourceSelect = (dataSource: DataSource) => {
    setQueriesChosenDataSource(dataSource);
    setReportsChosenDataSource(dataSource);
    // update conversation history
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Sources">
      {isLoading ? (
        <div className="flex justify-center mt-4 py-4">
          <svg className="animate-spin h-8 w-8 text-black" viewBox="0 0 24 24">
            {/* SVG path for spinner here */}
          </svg>
        </div>
      ) : (
        <ul>
          {dataSources.length === 0 ? (
            <p className="text-left">No Data Sources connected yet</p>
          ) : (
            dataSources.map((source: DataSource, _) => (
              <div key={source.id} className="mt-2 mb-2 flex items-center">
                <li
                  className={`cursor-pointer p-2 rounded-md flex overflow-x-hidden items-center flex-1 ${
                    queriesChosenDataSource?.id === source.id
                      ? 'bg-blue-100'
                      : 'bg-[#f8f9fa]'
                  }`}
                  onClick={() => {
                    handleDataSourceSelect(source);
                    onClose();
                  }}
                >
                  <span className="ml-2">
                    {source.type === 'csv' ? (
                      <BsFileEarmarkSpreadsheetFill size="16" />
                    ) : (
                      <FaQuestionCircle size="16" />
                    )}
                  </span>
                  <p className="ml-2 flex-1 text-ellipsis w-full">
                    {source.name}
                  </p>
                </li>
              </div>
            ))
          )}
        </ul>
      )}
      <ModalButtons
        onClose={onClose}
        handleConnect={onClose}
        hideConnectBtn
        showCloseBtnToTheRight
      />
    </ModalWrapper>
  );
};

import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Spinner from 'components/spinner/Spinner';
import { useReportsStore } from '../../zustand/reports/reportsStore';
import {
  QueryConversation,
  useQueriesState,
} from '../../zustand/queries/queriesStore';
import { DataSource } from 'interfaces/DataTypes';
import { v4 } from 'uuid';
import { formatIsoDateOnQueriesHistory } from 'utils/formatters';
import { NEW_THREAD_CONVERSATION_NAME } from 'utils/constants';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function QueriesPageDataSourceSelectionDropDown() {
  const {
    dataSources,
    setQueriesChosenDataSource,
    queriesChosenDataSource,
    setReportsChosenDataSource,
  } = useHarborStore();

  const { setSelectedDrillDownReport, setQueryReport } = useReportsStore();

  const {
    setCurrentQueryConversation,
    setCurrentCarouselIndex,
    setQueriesTextAreaText,
  } = useQueriesState();

  const createNewThread = () => {
    setCurrentCarouselIndex(0);
    setSelectedDrillDownReport(null);
  };

  const { errorMessage, isLoading } = useFetchDataSources();

  const { addConversationToHistory } = useQueriesState();

  const handleDataSourceSelect = (dataSource: any) => {
    setQueriesChosenDataSource(dataSource);
    setReportsChosenDataSource(dataSource);
    createNewThread();
    // update conversation history
    const newQueryConversation: QueryConversation = {
      id: v4(),
      conversationName: NEW_THREAD_CONVERSATION_NAME,
      items: [],
      datasourceId: dataSource.id,
      createdAt: new Date().toISOString(),
      unsaved: true,
    };
    addConversationToHistory(newQueryConversation);
    setQueryReport(null);
    setQueriesTextAreaText('');
    setCurrentQueryConversation(newQueryConversation);
  };

  return (
    <>
      <div className="w-auto h-[1.75rem] flex-col items-center content-center">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="max-w-fit inline-flex w-full items-center text-white justify-center gap-x-1.5 rounded-md bg-blue-500 px-3 py-1 text-sm font-medium shadow-sm hover:bg-[#2064e4] border border-blue-500 h-[1.75rem]">
              <FaPlus size={'0.75rem'} className="font-medium" /> New
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
            <Menu.Items className="overflow-y-scroll max-h-[80vh] absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {isLoading ? (
                  <div className="h-10 flex items-center justify-center">
                    <Spinner className="h-4 w-4 border-2" />
                  </div>
                ) : dataSources.length === 0 ? (
                  <Menu.Item key={'123'} disabled>
                    <a
                      href=""
                      className={classNames(
                        'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                      )}
                    >
                      <div className="flex items-center">
                        {/* <img src={source.avatar} alt="" className="h-5 w-5 flex-shrink-0 rounded-full" /> */}
                        <span
                          className={classNames(
                            'font-medium text-gray-500',
                            'ml-3 block truncate',
                          )}
                        >
                          No Data Sources connected yet
                        </span>
                      </div>
                    </a>
                  </Menu.Item>
                ) : (
                  dataSources.map((source, index) => (
                    <div className="" key={index}>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(
                              active
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-700',
                              'group flex items-center px-4 py-2 text-sm',
                            )}
                            onClick={() => {
                              handleDataSourceSelect(source);
                            }}
                          >
                            {source.name}
                          </a>
                        )}
                      </Menu.Item>
                    </div>
                  ))
                )}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </>
  );
}
