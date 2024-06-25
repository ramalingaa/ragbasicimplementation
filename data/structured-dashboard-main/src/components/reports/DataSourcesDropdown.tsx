import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { FaFileCsv, FaHubspot, FaSalesforce, FaTable } from 'react-icons/fa';
import { TbBrandGoogleBigQuery } from 'react-icons/tb';
import { useReportsStore } from '../../zustand/reports/reportsStore';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const DataSourcesDropdown = () => {
  const { dataSources, setReportsChosenDataSource, reportsChosenDataSource } =
    useHarborStore();
  const {
    reportCreationNoDataSourceSelected,
    setReportCreationNoDataSourceSelected,
  } = useReportsStore();

  const handleDataSourceSelect = (dataSource: any) => {
    setReportsChosenDataSource(dataSource);
    setReportCreationNoDataSourceSelected(false);
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

  return (
    <Listbox value={reportsChosenDataSource} onChange={handleDataSourceSelect}>
      {({ open }) => (
        <>
          <div className="relative mt-6">
            <Listbox.Button
              className={classNames(
                'relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6',
                reportCreationNoDataSourceSelected
                  ? 'ring-red-500 ring-2'
                  : 'ring-gray-300',
              )}
            >
              <span className="inline-flex w-full truncate">
                <span className="truncate">
                  {reportsChosenDataSource
                    ? reportsChosenDataSource.name
                    : 'Harbor'}
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
  );
};
