'use client';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import EmptyState from 'components/emptyState/EmptyState';
import useFetchQueriesHistory from 'hooks/queries/useFetchQueriesHistory';
import useQueriesConversation from 'hooks/queries/useQueriesConversation';
import { Fragment, useState } from 'react';
import { formatIsoDateOnQueriesHistory } from 'utils/formatters';
import { useConfirmationMessageStore } from '../../zustand/confirmationMessage/confirmationMessageStore';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import {
  QueryConversation,
  useQueriesState,
} from '../../zustand/queries/queriesStore';
import useQueriesBookmark from 'hooks/queries/useQueriesBookmark';
import useQueries from 'hooks/queries/useQueries';

export default function HistoryContainer() {
  const { threadsViewMode, setThreadsViewMode } = useQueriesState();
  return (
    <HistorySlideover
      open={threadsViewMode === 'view'}
      setOpen={() => setThreadsViewMode('collapse')}
      staticPos={true}
    />
  );
}

const tabs = [
  { name: 'Threads', href: '#', current: true },
  { name: 'Bookmarks', href: '#', current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function HistorySlideover({
  open,
  setOpen,
  staticPos,
}: {
  open: boolean;
  setOpen: any;
  staticPos: boolean;
}) {
  const {
    currentQueryConversation,
    queryConversationHistory,
    setCurrentQueryConversation,
    setCurrentCarouselIndex,
    currentCarouselIndex,
    setSelectedBookmarkMode,
  } = useQueriesState();

  const {
    setQueriesChosenDataSource,
    setReportsChosenDataSource,
    dataSources,
  } = useHarborStore();

  const { deleting, deleteQueryConversation } = useQueriesConversation();

  const { isLoading } = useFetchQueriesHistory();

  const selectCurrentConversation = (conversation: QueryConversation) => {
    setCurrentQueryConversation(conversation);
    let currQueryDs = dataSources.find(
      (dataSource) => dataSource.id === conversation.datasourceId,
    );
    setQueriesChosenDataSource(
      dataSources.find(
        (dataSource) => dataSource.id === conversation.datasourceId,
      ),
    );
    setReportsChosenDataSource(
      dataSources.find(
        (dataSource) => dataSource.id === conversation.datasourceId,
      ),
    );
  };

  const [currentlyDeleting, setCurrentlyDeleting] = useState<string | null>(
    null,
  );

  const handleDeleteConversation = async (conversationId: string) => {
    setCurrentlyDeleting(conversationId);
    await deleteQueryConversation(conversationId);
  };
  const { setConfirmationMessage } = useConfirmationMessageStore();

  const [activeTab, setActiveTab] = useState('Threads');

  const { updateItemBookmark } = useQueriesBookmark();
  const { copyThreadLinkToClipboard } = useQueries();
  const HistoryList = () => {
    if (activeTab === 'Threads') {
      return (
        <ul
          role="list"
          className="flex-1 divide-y divide-gray-200 overflow-y-auto h-full"
        >
          {isLoading ? (
            <div className="mt-4 py-4 flex justify-center h-full items-center">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-[#eeeff1]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            </div>
          ) : !queryConversationHistory ||
            queryConversationHistory?.conversations.length === 0 ? (
            <EmptyState
              title="No Threads"
              desciption="Get started by creating a new thread."
            />
          ) : (
            queryConversationHistory?.conversations
              .slice()
              .reverse()
              .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
              .map((conversation) => (
                <li key={conversation.id} className="cursor-pointer">
                  <div className="group relative flex items-center px-5 py-6">
                    <a
                      onClick={() => {
                        setSelectedBookmarkMode(false);
                        selectCurrentConversation(conversation);
                        setCurrentCarouselIndex(0);
                      }}
                      className="-m-1 block flex-1 p-1"
                    >
                      <div
                        className="absolute inset-0 group-hover:bg-gray-50"
                        aria-hidden="true"
                      />
                      <div className="relative flex min-w-0 flex-1 items-center">
                        <span className="relative flex">
                          <span
                            className={classNames(
                              currentQueryConversation?.id === conversation.id
                                ? 'bg-green-400'
                                : 'bg-gray-300',
                              'block h-2.5 w-2.5 rounded-full ring-2 ring-white',
                            )}
                            aria-hidden="true"
                          />
                        </span>
                        <div className="ml-4 truncate flex flex-col">
                          <p className="truncate text-ellipsis text-pretty text-sm font-medium text-gray-900">
                            {currentlyDeleting === conversation.id
                              ? 'Deletion in progress...'
                              : conversation.conversationName != undefined
                                ? conversation.conversationName
                                : 'Conversation'}
                          </p>
                          {conversation?.createdAt && (
                            <p className="mt-2 truncate text-xs text-gray-500">
                              {formatIsoDateOnQueriesHistory(
                                conversation?.createdAt,
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </a>
                    <Menu
                      as="div"
                      className="relative ml-2 inline-block flex-shrink-0 text-left"
                    >
                      <Menu.Button className="group relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open options menu</span>
                        <span className="flex h-full w-full items-center justify-center rounded-full">
                          <EllipsisVerticalIcon
                            className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                        </span>
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-9 top-0 z-10 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  onClick={() =>
                                    setConfirmationMessage(
                                      'Delete Thread',
                                      'Are you sure you want to delete this thread? This action cannot be undone.',
                                      async () =>
                                        await handleDeleteConversation(
                                          conversation.id,
                                        ),
                                      deleting,
                                    )
                                  }
                                  className={classNames(
                                    active
                                      ? 'bg-gray-100 text-red-500'
                                      : 'text-red-400',
                                    'block px-4 py-2 text-sm',
                                  )}
                                >
                                  Delete
                                </a>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  onClick={() =>
                                    copyThreadLinkToClipboard(conversation.id)
                                  }
                                  className={classNames(
                                    active
                                      ? 'bg-gray-100 text-gray-700'
                                      : 'text-gray-600',
                                    'block px-4 py-2 text-sm',
                                  )}
                                >
                                  Copy Link
                                </a>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </li>
              )))
          }
        </ul >
      );
    } else if (activeTab === 'Bookmarks') {
      const bookmarkedItems = queryConversationHistory?.conversations
        .flatMap((conversation) =>
          conversation.items.filter((item) => item.bookmarked),
        )
        .sort((a, b) => (a.id < b.id ? 1 : -1));

      return (
        <ul
          role="list"
          className="flex-1 divide-y divide-gray-200 overflow-y-auto h-full"
        >
          {isLoading ? (
            <div className="mt-4 py-4 flex justify-center h-full items-center">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-[#eeeff1]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
            </div>
          ) : !bookmarkedItems || bookmarkedItems.length === 0 ? (
            <EmptyState
              title="No Bookmarked Items"
              desciption="Bookmark query items to see them here."
            />
          ) : (
            bookmarkedItems.map((item) => (
              <li key={item.id} className="cursor-pointer">
                <div className="group relative flex items-center px-5 py-6">
                  <a
                    onClick={() => {
                      const conversation =
                        queryConversationHistory?.conversations.find((conv) =>
                          conv.items.some(
                            (convItem) => convItem.id === item.id,
                          ),
                        );
                      if (conversation) {
                        selectCurrentConversation(conversation);
                        const itemIndex = conversation.items.findIndex(
                          (convItem) => convItem.id === item.id,
                        );
                        setCurrentCarouselIndex(itemIndex);
                        setSelectedBookmarkMode(true);
                      }
                    }}
                    className="-m-1 block flex-1 p-1"
                  >
                    <div
                      className="absolute inset-0 group-hover:bg-gray-50"
                      aria-hidden="true"
                    />
                    <div className="relative flex min-w-0 flex-1 items-center">
                      <span className="relative flex">
                        <span
                          className={classNames(
                            currentQueryConversation?.items[
                              currentCarouselIndex
                            ]?.id === item.id
                              ? 'bg-green-400'
                              : 'bg-gray-300',
                            'block h-2.5 w-2.5 rounded-full ring-2 ring-white',
                          )}
                          aria-hidden="true"
                        />
                      </span>
                      <div className="ml-4 truncate flex flex-col">
                        <p className="truncate text-ellipsis text-pretty text-sm font-medium text-gray-900">
                          {item.query}
                        </p>
                      </div>
                    </div>
                  </a>
                  <Menu
                    as="div"
                    className="relative ml-2 inline-block flex-shrink-0 text-left"
                  >
                    <Menu.Button className="group relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open options menu</span>
                      <span className="flex h-full w-full items-center justify-center rounded-full">
                        <EllipsisVerticalIcon
                          className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      </span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-9 top-0 z-10 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                onClick={() => {
                                  const conversationId =
                                    queryConversationHistory?.conversations.find(
                                      (conv) =>
                                        conv.items.some(
                                          (convItem) => convItem.id === item.id,
                                        ),
                                    )?.id || '';
                                  const conversation =
                                    queryConversationHistory?.conversations.find(
                                      (conv) =>
                                        conv.items.some(
                                          (convItem) => convItem.id === item.id,
                                        ),
                                    );
                                  if (conversation) {
                                    selectCurrentConversation(conversation);
                                    const itemIndex =
                                      conversation.items.findIndex(
                                        (convItem) => convItem.id === item.id,
                                      );
                                    setCurrentCarouselIndex(itemIndex);
                                    setSelectedBookmarkMode(true);
                                  }
                                  updateItemBookmark(item, item.id);
                                }}
                                className={classNames(
                                  active
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-700',
                                  'block px-4 py-2 text-sm',
                                )}
                              >
                                Unbookmark
                              </a>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))
          )}
        </ul>
      );
    }
  };

  if (staticPos)
    return (
      <>
        <div className="border-b border-gray-200">
          <div className="px-8 py-4">
            <nav className="-mb-px flex space-x-6">
              {tabs.map((tab) => (
                <a
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={classNames(
                    activeTab === tab.name
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium cursor-pointer',
                  )}
                >
                  {tab.name}
                </a>
              ))}
            </nav>
          </div>
        </div>
        <HistoryList />
      </>
    );

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed" />

        <div className="fixed overflow-hidden">
          <div className="absolute overflow-hidden">
            <div
              className={`pointer-events-none fixed inset-y-0 right-0 flex max-w-full`}
              style={{
                top: 'calc(6rem - 1px)',
                height: 'calc(100vh - 6rem + 1px)',
              }}
            >
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
                    <div className="border-b border-gray-200">
                      <div className="px-6">
                        <nav className="-mb-px flex space-x-6">
                          {tabs.map((tab) => (
                            <a
                              key={tab.name}
                              onClick={() => setActiveTab(tab.name)}
                              className={classNames(
                                activeTab === tab.name
                                  ? 'border-blue-500 text-blue-600'
                                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                                'whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium cursor-pointer',
                              )}
                            >
                              {tab.name}
                            </a>
                          ))}
                        </nav>
                      </div>
                    </div>
                    <HistoryList />
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
