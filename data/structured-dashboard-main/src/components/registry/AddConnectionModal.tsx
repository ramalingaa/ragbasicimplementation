import React, { useEffect, useState } from 'react';
import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import useFetchDataSources from 'hooks/harbor/useFetchDataSources';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { v4 as uuidv4 } from 'uuid';
import useRegistryConnections from 'hooks/registry/useRegistryConnections';
import {ModalWrapper} from 'components/modal/ModalWrapper';
import ModalButtons from 'components/modal/ModalButtons';

interface AddConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddConnectionModal: React.FC<AddConnectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Overlay styling
  const overlayStyle: React.CSSProperties = {
    display: isOpen ? 'block' : 'none',
    position: 'fixed',
    zIndex: 10,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: `rgba(0, 0, 0, 0.5)`,
  };

  // Container for Modal content
  const contentStyle: React.CSSProperties = {
    backgroundColor: '#fefefe',
    marginTop: '10%',
    marginLeft: '18%',
    width: '80%',
    padding: '20px',
    boxSizing: 'border-box',
    border: '1px solid #888',
    borderRadius: '10px',
    zIndex: 11,
  };

  const [selectedDataSources, setSelectedDataSources] = useState<{
    first: string | null;
    second: string | null;
  }>({ first: null, second: null });

  const { errorMessage, isLoading, getFileContents } = useFetchDataSources();

  const dataSources = useHarborStore((state) => state.dataSources);

  useEffect(() => {
    const fetchContents = async () => {
      if (selectedDataSources.first) {
        const dataSource = dataSources.find(
          (ds) => ds.id === selectedDataSources.first,
        );
        if (dataSource && !dataSource.decodedContents)
          await getFileContents(dataSource);
      }
      if (selectedDataSources.second) {
        const dataSource = dataSources.find(
          (ds) => ds.id === selectedDataSources.second,
        );
        if (dataSource && !dataSource.decodedContents)
          await getFileContents(dataSource);
      }
    };
    fetchContents();
  }, [selectedDataSources.first, selectedDataSources.second]);

  type ColumnType = 'joining' | 'syncing';

  interface SelectedColumns {
    joining: { first: string | null; second: string | null };
    syncing: { first: string | null; second: string | null };
  }

  const [selectedColumns, setSelectedColumns] = useState<SelectedColumns>({
    joining: { first: null, second: null },
    syncing: { first: null, second: null },
  });

  interface SelectionPhase {
    phase: 'joining' | 'syncing';
  }

  const [selectionPhase, setSelectionPhase] = useState<SelectionPhase>({
    phase: 'joining',
  });

  const handleColumnSelect = (dataSourceId: string, column: string) => {
    const isJoiningComplete =
      selectedColumns.joining.first && selectedColumns.joining.second;
    const currentPhase = isJoiningComplete ? 'syncing' : 'joining';

    if (
      currentPhase === 'syncing' &&
      (!selectedColumns.syncing.first || !selectedColumns.syncing.second)
    ) {
      setSelectionPhase({ phase: 'syncing' });
    } else if (currentPhase === 'joining') {
      setSelectionPhase({ phase: 'joining' });
    }

    setSelectedColumns((prev: SelectedColumns) => {
      const update = { ...prev };
      if (
        update[currentPhase].first === null ||
        dataSourceId === selectedDataSources.first
      ) {
        update[currentPhase].first = column;
      } else if (
        update[currentPhase].second === null ||
        dataSourceId === selectedDataSources.second
      ) {
        update[currentPhase].second = column;
      }
      return update;
    });
  };

  const isSelectedColumn = (dataSourceId: string, columnKey: string) => {
    const isJoiningSelected =
      (dataSourceId === selectedDataSources.first &&
        selectedColumns.joining.first === columnKey) ||
      (dataSourceId === selectedDataSources.second &&
        selectedColumns.joining.second === columnKey);
    const isSyncingSelected =
      selectionPhase.phase === 'syncing' &&
      ((dataSourceId === selectedDataSources.first &&
        selectedColumns.syncing.first === columnKey) ||
        (dataSourceId === selectedDataSources.second &&
          selectedColumns.syncing.second === columnKey));

    return isJoiningSelected || isSyncingSelected;
  };

  const getColumnSelectionType = (
    dataSourceId: string,
    columnKey: string,
  ): 'joining' | 'syncing' | 'none' => {
    const isJoiningSelected =
      (dataSourceId === selectedDataSources.first &&
        selectedColumns.joining.first === columnKey) ||
      (dataSourceId === selectedDataSources.second &&
        selectedColumns.joining.second === columnKey);

    const isSyncingSelected =
      selectionPhase.phase === 'syncing' &&
      ((dataSourceId === selectedDataSources.first &&
        selectedColumns.syncing.first === columnKey) ||
        (dataSourceId === selectedDataSources.second &&
          selectedColumns.syncing.second === columnKey));

    if (isJoiningSelected) {
      return 'joining';
    } else if (isSyncingSelected) {
      return 'syncing';
    } else {
      return 'none';
    }
  };

  const {
    isLoading: registryConnectionLoading,
    error,
    saveConnection,
  } = useRegistryConnections();

  const initiateSaveConnection = async () => {
    const connection = {
      dataSources: [selectedDataSources.first, selectedDataSources.second],
      selectedColumns,
      id: uuidv4(),
    };

    await saveConnection(connection);
    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title='Add Connection'
      className='w-1/2'
    >
      <div className='flex flex-col'>
        {isLoading ? (
          <div className="mt-4 py-4 flex justify-center">
            <div className="spinner size-xl text-gray-900"></div>
          </div>
        ) : (
          <div className='flex flex-row w-full'>
            <div className='flex w-full'>
              <SelectMenu
                className=''
                title="Select object"
                setSelected={(e: any) =>
                  setSelectedDataSources((prev) => ({
                    ...prev,
                    first: e.name,
                  }))
                }
                selected={selectedDataSources.first}
              >
                {dataSources.map((dataSource) => (
                  <Listbox.Option
                    key={dataSource.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={dataSource}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {dataSource.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
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

              </SelectMenu>

              <SelectMenu
                className='ml-4'
                title="Select object"
                setSelected={(e: any) =>
                  setSelectedDataSources((prev) => ({
                    ...prev,
                    second: e.name,
                  }))
                }
                selected={selectedDataSources.second}
              >
                {dataSources.map((dataSource) => (
                  <Listbox.Option
                    key={dataSource.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9'
                      )
                    }
                    value={dataSource}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate')}>
                          {dataSource.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-indigo-600',
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
              </SelectMenu>
            </div>
            <div className='flex mt-10 w-full justify-around'>
              {dataSources
                .filter((ds) =>
                  [
                    selectedDataSources.first,
                    selectedDataSources.second,
                  ].includes(ds.id),
                )
                .map((dataSource) => (
                  <div key={dataSource.id}>
                    <span className='font-bold mb-4'>
                      {dataSource.name}:
                    </span>
                    <div
                      className='overflow-x-auto border border-gray-300 rounded-md p-4 w-96 h-96'
                    >
                      {dataSource.decodedContents ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200 table-auto">
                            <caption className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {dataSource.name}
                            </caption>
                            <thead className="bg-gray-50">
                              <tr>
                                {Object.keys(dataSource.decodedContents[0] || {}).map((key, index) => (
                                  <th
                                    key={index}
                                    onClick={() => handleColumnSelect(dataSource.id, key)}
                                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${getColumnSelectionType(dataSource.id, key) === 'joining'
                                      ? 'bg-blue-100'
                                      : getColumnSelectionType(dataSource.id, key) === 'syncing'
                                        ? 'bg-green-100'
                                        : 'transparent'
                                      }`}
                                  >
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {dataSource.decodedContents.map((row: any, rowIndex: any) => (
                                <tr key={rowIndex}>
                                  {Object.keys(row).map((key, valueIndex) => (
                                    <td
                                      key={valueIndex}
                                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${getColumnSelectionType(dataSource.id, key) === 'joining'
                                        ? 'bg-blue-100'
                                        : getColumnSelectionType(dataSource.id, key) === 'syncing'
                                          ? 'bg-green-100'
                                          : 'transparent'
                                        }`}
                                    >
                                      {typeof row[key] === 'string' || typeof row[key] === 'number'
                                        ? row[key]
                                        : null}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                      ) : (
                        <span className='text-gray-500'>Fetching contents...</span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        {/* New container for displaying selected columns and filters */}
        <div className='mt-10'>
          <span className='text-lg mb-2'>
            Selected Columns
          </span>
          <div className='mb-4'>
            <span className='font-bold'>Joining Columns:</span>
            <span>
              {selectedColumns.joining.first},{' '}
              {selectedColumns.joining.second}
            </span>
          </div>
          <div className='mb-4'>
            <span className='font-bold'>Syncing Columns:</span>
            <span>
              {selectedColumns.syncing.first},{' '}
              {selectedColumns.syncing.second}
            </span>
          </div>
          <div className='mb-4'>
            <span className='font-bold'>Filters:</span>
            <select placeholder="Coming soon">
              <option value="coming_soon">Coming soon</option>
            </select>
          </div>
        </div>
      </div>
      <ModalButtons
        onClose={onClose}
        handleConnect={initiateSaveConnection}
        connectBtnText='Add'
      />
    </ModalWrapper>
  );
};

import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function SelectMenu({ selected, setSelected, children, className, title }: { selected: any, setSelected: any, children: any, className: string, title: string }) {

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className={`block text-sm font-medium leading-6 text-gray-900 ${className}`}>{title}</Listbox.Label>
          <div className="relative mt-2">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="block truncate">{selected}</span>
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
                {children}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}

export default AddConnectionModal;
