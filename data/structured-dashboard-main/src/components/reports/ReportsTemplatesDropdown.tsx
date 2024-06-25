import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { useReportsStore } from '../../zustand/reports/reportsStore';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface ReportsTemplatesDropdownProps {
  selectedTemplate?: { id: number; name: string };
}

const ReportsTemplatesDropdown: React.FC<ReportsTemplatesDropdownProps> = ({
  selectedTemplate,
}) => {
  const { reportsChosenTemplate, setReportsChosenTemplate } = useReportsStore();

  const templates = [{ id: 1, name: 'Sales Conversion' }];

  return (
    <Listbox value={reportsChosenTemplate} onChange={setReportsChosenTemplate}>
      {({ open }) => (
        <>
          <div className="relative mt-6">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6">
              <span className="inline-flex w-full truncate">
                <span className="truncate">
                  {reportsChosenTemplate?.name || 'Templates'}
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
              as={React.Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {templates.map((template) => (
                  <Listbox.Option
                    key={template.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'bg-blue-600 text-white' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                      )
                    }
                    value={template}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? 'font-semibold' : 'font-normal',
                            'truncate',
                          )}
                        >
                          {template.name}
                        </span>

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

export default ReportsTemplatesDropdown;
