import React, { Fragment, useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { ModalWrapper } from 'components/modal/ModalWrapper';
import ModalButtons from 'components/modal/ModalButtons';
import useFetchQueriesHistory from 'hooks/queries/useFetchQueriesHistory';
import { useQueriesState } from '../../zustand/queries/queriesStore';

interface AddBookmarkedQueryItemsChartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: any) => void;
}

const AddBookmarkedQueryItemsChartsModal: React.FC<
  AddBookmarkedQueryItemsChartsModalProps
> = ({ isOpen, onClose, onAdd }) => {
  const { isLoading } = useFetchQueriesHistory();
  const { queryConversationHistory } = useQueriesState();
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedItem(null);
    }
  }, [isOpen]);

  const bookmarkedItems = queryConversationHistory?.conversations
    .flatMap((conversation: any) =>
      conversation.items.filter((item: any) => item.bookmarked),
    )
    .sort((a, b) => (a.id < b.id ? 1 : -1));

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={'Add bookmarked queries'}
      className="h-auto sm:w-full sm:max-w-lg overflow-visible"
    >
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        {({ open }) => (
          <>
            <div className="relative mt-6">
              <Listbox.Button
                className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6 ring-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <span className="inline-flex w-full truncate">
                  <span className="truncate">
                    {selectedItem
                      ? selectedItem.query
                      : 'Select a bookmarked query'}
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
                <Listbox.Options
                  static
                  className="absolute z-50 mt-1 max-h-[50vh] overflow-y-auto w-full rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                  }}
                >
                  {bookmarkedItems?.map((item) => (
                    <Listbox.Option
                      key={item.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-blue-600 text-white' : 'text-gray-900'
                        }`
                      }
                      value={item}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {item.query}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-blue-600'
                              }`}
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
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className={`inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            isLoading
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-blue-600 hover:bg-blue-500'
          }`}
          onClick={async () => {
            if (selectedItem) {
              onAdd(selectedItem);
            }
            onClose();
          }}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Add'}
        </button>
      </div>
    </ModalWrapper>
  );
};

export default AddBookmarkedQueryItemsChartsModal;
