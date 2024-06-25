import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { DataViewModalWrapper } from 'components/modal/ModalWrapper';
import useSaveBlock from 'hooks/blocks/useSaveBlock';
import useFetchDataSources from 'hooks/harbor/useFetchDataSources';
import React, { Fragment, useState } from 'react';
import { FaFileCsv, FaHubspot, FaSalesforce, FaTable } from 'react-icons/fa';
import { TbBrandGoogleBigQuery } from 'react-icons/tb';
import { v4 as uuidv4 } from 'uuid';
import { Block, useBlocksStore } from '../../zustand/blocks/blocksStore';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import useGenerateBlock from './useGenerateBlock';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface BlocksCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BlocksCreationModal: React.FC<BlocksCreationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { setBlocksChosenDataSource, blocksChosenDataSource } =
    useBlocksStore();

  const { dataSources } = useHarborStore();

  const { errorMessage, isLoading } = useFetchDataSources();

  const [blockName, setBlockName] = useState('');
  const [blockMetric, setBlockMetric] = useState('');

  const {
    isLoading: isGeneratingBlock,
    error: blockGenerationError,
    dataSourceWarning: blockDataSourceWarning,
    generateBlock,
  } = useGenerateBlock();

  const handleDataSourceSelect = (dataSource: any) => {
    setBlocksChosenDataSource(dataSource);
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'csv':
        return <FaFileCsv color="#ff943c" />;
      case 'salesforce':
        return <FaSalesforce className="text-blue-400" />;
      case 'spreadsheet':
        return <FaTable color="pink" />;
      case 'bigquery':
        return <TbBrandGoogleBigQuery color="blue" />;
      case 'hubspot':
        return <FaHubspot color="orange" />;
      default:
        return <FaTable color="gray" />;
    }
  };

  const { saveBlock } = useSaveBlock();

  const handleBuildBlock = async () => {
    const { blocks, blockCreationName } = useBlocksStore.getState();

    const newBlock: Block = {
      id: uuidv4(),
      blockName: blockCreationName,
      blockDataSource: blocksChosenDataSource || undefined,
      blockMetric,
    };

    saveBlock(newBlock);

    await generateBlock(newBlock.id, blockMetric);

    onClose();
  };

  return (
    <DataViewModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Create Block"
      className="fixed inset-0 sm:w-[98%] sm:max-w-[98%] items-stretch"
      showBlockBuildButton={
        useBlocksStore((state) => state.blockCreationName.trim() !== '') &&
        blockMetric.trim() !== ''
      }
      onBlockBuild={handleBuildBlock}
    >
      <div className="flex-1 w-full h-full flex flex-col">
        <div className="mt-4">
          <input
            type="text"
            placeholder="Block Name"
            value={useBlocksStore((state) => state.blockCreationName)}
            onChange={(e) =>
              useBlocksStore.getState().setBlockCreationName(e.target.value)
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Listbox
          value={blocksChosenDataSource}
          onChange={handleDataSourceSelect}
        >
          {({ open }) => (
            <>
              <div className="relative mt-6">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6">
                  <span className="inline-flex w-full truncate">
                    <span className="truncate">
                      {blocksChosenDataSource
                        ? blocksChosenDataSource.name
                        : 'Select Data Source'}
                    </span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-[70vh] w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {dataSources.map((source) => (
                      <Listbox.Option
                        key={source.id}
                        className={({ active }) =>
                          classNames(
                            active ? 'bg-blue-600 text-white' : 'text-gray-900',
                            'relative cursor-default select-none py-2 pl-3 pr-9',
                          )
                        }
                        value={source}
                      >
                        {({ selected, active }) => (
                          <>
                            <div className="flex items-center">
                              <span className={classNames('mr-2 truncate')}>
                                {getSourceIcon(
                                  source?.fileMetadata?.source || 'csv',
                                )}
                              </span>
                              <span
                                className={classNames(
                                  selected ? 'font-semibold' : 'font-normal',
                                  'truncate',
                                )}
                              >
                                {source.name}
                              </span>
                            </div>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? 'text-white' : 'text-blue-600',
                                  'absolute inset-y-0 right-0 flex items-center pr-4',
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
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

        <div className="relative mt-4">
          <Listbox value={blockMetric} onChange={setBlockMetric}>
            {({ open }) => (
              <>
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6">
                  <span className="inline-flex w-full truncate">
                    <span className="truncate">
                      {blockMetric || 'Select Block Metric'}
                    </span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <Listbox.Option
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-blue-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value="Customer Health Score"
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            )}
                          >
                            Customer Health Score
                          </span>
                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-blue-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4',
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-blue-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value="Customer Churn Rate"
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            )}
                          >
                            Customer Churn Rate
                          </span>
                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-blue-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4',
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-blue-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value="Monthly Recurring Revenue (MRR)"
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            )}
                          >
                            Monthly Recurring Revenue (MRR)
                          </span>
                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-blue-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4',
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-blue-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value="Annual Recurring Revenue (ARR)"
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            )}
                          >
                            Annual Recurring Revenue (ARR)
                          </span>
                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-blue-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4',
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-blue-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value="Customer Lifetime Value (CLTV or LTV) (Coming Soon)"
                      disabled
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            )}
                          >
                            Customer Lifetime Value (CLTV or LTV) (Coming Soon)
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-blue-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value="Net Promoter Score (NPS) (Coming Soon)"
                      disabled
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            )}
                          >
                            Net Promoter Score (NPS) (Coming Soon)
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-blue-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value="Customer Satisfaction Score (CSAT) (Coming Soon)"
                      disabled
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            )}
                          >
                            Customer Satisfaction Score (CSAT) (Coming Soon)
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-blue-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value="Average Revenue Per User (ARPU) (Coming Soon)"
                      disabled
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            )}
                          >
                            Average Revenue Per User (ARPU) (Coming Soon)
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-blue-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value="Customer Acquisition Cost (CAC) (Coming Soon)"
                      disabled
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            )}
                          >
                            Customer Acquisition Cost (CAC) (Coming Soon)
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-blue-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value="Gross Margin (Coming Soon)"
                      disabled
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            )}
                          >
                            Gross Margin (Coming Soon)
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-blue-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value="Expansion Revenue (Coming Soon)"
                      disabled
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            )}
                          >
                            Expansion Revenue (Coming Soon)
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-blue-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value="Sales Cycle Length (Coming Soon)"
                      disabled
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            )}
                          >
                            Sales Cycle Length (Coming Soon)
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-blue-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value="Lead Conversion Rate (Coming Soon)"
                      disabled
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            )}
                          >
                            Lead Conversion Rate (Coming Soon)
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                    <Listbox.Option
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-blue-600 text-white' : 'text-gray-900',
                          'relative cursor-default select-none py-2 pl-3 pr-9',
                        )
                      }
                      value="Sales Qualified Leads (SQL) to Customer Rate (Coming Soon)"
                      disabled
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={classNames(
                              selected ? 'font-semibold' : 'font-normal',
                              'block truncate',
                            )}
                          >
                            Sales Qualified Leads (SQL) to Customer Rate (Coming
                            Soon)
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  </Listbox.Options>
                </Transition>
              </>
            )}
          </Listbox>
        </div>
      </div>
    </DataViewModalWrapper>
  );
};

export default BlocksCreationModal;
