import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import ChartDataPreview from 'components/reports/ChartDataPreview';
import KpiCardInfo from 'components/reports/KpiCardInfo';
import ReportsChart from 'components/reports/ReportsChart';
import useQueriesBookmark from 'hooks/queries/useQueriesBookmark';
import useThemeColors from 'hooks/useThemeColors';
import React, { Fragment } from 'react';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import {
  QueryConversation,
  QueryConversationItem,
  useQueriesState,
} from '../../zustand/queries/queriesStore';
import { QueriesGeneratingSkeleton } from './Queries';
import QueriesCustomDrawer from './QueriesCustomDrawer';
import QueryPreview from './QueryPreview';

interface CarouselProps {
  currentQueryConversation: QueryConversation;
  items: QueryConversationItem[];
}

const Dot: React.FC<{ isActive: boolean; onClick?: any }> = ({
  isActive,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`${
      isActive ? 'w-3 h-3 bg-blue-500' : 'w-2 h-2 bg-gray-300'
    } rounded-full mx-1 cursor-pointer`}
  />
);

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function Headings({ tabs, setTabs }: { tabs: any; setTabs: any }) {
  const handleHeadingChange = (newHeadingName: string) => {
    const updatedTabs = tabs.map((tab: any) => {
      if (tab.name === newHeadingName) {
        return {
          ...tab,
          current: true,
        };
      } else {
        return {
          ...tab,
          current: false,
        };
      }
    });
    setTabs(updatedTabs);
  };

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          value={tabs.find((tab: any) => tab.current).name}
          onChange={() => {}}
        >
          {tabs.map((tab: any) => (
            <option
              key={tab.name}
              value={tab.name}
              onClick={(e: any) => handleHeadingChange(e.target.textContent)}
            >
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab: any) => (
            <a
              key={tab.name}
              href="#"
              className={classNames(
                tab.current
                  ? 'bg-gray-100 text-gray-700'
                  : 'text-gray-500 hover:text-gray-700',
                'rounded-md px-3 py-2 text-sm font-medium',
              )}
              aria-current={tab.current ? 'page' : undefined}
              onClick={(e: any) => handleHeadingChange(e.target.textContent)}
            >
              {tab.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

const Carousel: React.FC<CarouselProps> = ({
  currentQueryConversation,
  items,
}) => {
  const {
    currentCarouselIndex,
    setCurrentCarouselIndex,
    updateConversationItemChartType,
    toggleItemBookmark,
    selectedBookmarkMode,
  } = useQueriesState();
  const { themeContainerBgColor } = useThemeColors();
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const goToPrevious = () => {
    if (!selectedBookmarkMode) {
      setCurrentCarouselIndex(currentCarouselIndex - 1);
    }
  };

  const goToNext = () => {
    if (!selectedBookmarkMode) {
      setCurrentCarouselIndex(currentCarouselIndex + 1);
    }
  };

  const currentItem = items[currentCarouselIndex];

  const handleChartTypeChange = (chartType: string) => {
    updateConversationItemChartType(chartType);
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const { updateItemBookmark } = useQueriesBookmark();

  const handleBookmarkToggle = (item: any) => {
    if (currentQueryConversation) {
      console.log('toggleItemBookmark', currentQueryConversation);
      updateItemBookmark(item, item.id);
    }
  };

  const tabsInit = [
    {
      name: 'Visualization',
      href: '#',
      current: true,
      component: (currentItem: any) => (
        <>
          <div className="rounded-md mt-4 p-4 border-[1px] border-[#eeeff1] relative group">
            <div className="flex justify-between items-start">
              <span className="font-bold text-md">
                {currentItem?.queryReport?.answer
                  ? JSON.stringify(currentItem.queryReport.answer).replace(
                      /^"|"$/g,
                      '',
                    )
                  : ''}
              </span>
              <div className="absolute top-2 right-2 hidden group-hover:block">
                {currentItem?.bookmarked ? (
                  <FaBookmark
                    className="w-5 h-5 cursor-pointer text-[#ca8a04]"
                    onClick={() => handleBookmarkToggle(currentItem)}
                  />
                ) : (
                  <FaRegBookmark
                    className="w-5 h-5 cursor-pointer text-gray-400 hover:text-gray-500"
                    onClick={() => handleBookmarkToggle(currentItem)}
                  />
                )}
              </div>
            </div>
            {currentItem?.queryReport?.chartInfo && (
              <ReportsChart chartInfo={currentItem?.queryReport.chartInfo} />
            )}
          </div>
        </>
      ),
      renderAnswer: true,
    },
    {
      name: 'Data',
      href: '#',
      current: false,
      component: (currentItem: any) => (
        <>
          {currentItem?.queryReport?.chartInfo && (
            <ChartDataPreview
              chartInfo={currentItem?.queryReport.chartInfo}
              reportDataSource={currentItem?.queryReport.reportDataSource}
              queryAnswer={currentItem?.queryReport.answer}
            />
          )}
          {currentItem?.queryReport?.kpiCardInfo && (
            <KpiCardInfo
              title={currentItem.queryReport.kpiCardInfo.title}
              resultEntity={currentItem.queryReport.kpiCardInfo.resultEntity}
              result={currentItem.queryReport.kpiCardInfo.result}
              resultConnotation={
                currentItem.queryReport.kpiCardInfo.resultConnotation
              }
            />
          )}
        </>
      ),
      renderAnswer: false,
    },
    {
      name: 'Query Preview',
      href: '#',
      current: false,
      component: (currentItem: any) => (
        <>
          <div className="rounded-md mt-4 p-4 border-[1px] border-[#eeeff1]">
            <span className="font-bold text-md mb-4">
              {currentItem?.queryReport?.answer
                ? JSON.stringify(currentItem.queryReport.answer).replace(
                    /^"|"$/g,
                    '',
                  )
                : ''}
            </span>
            <QueryPreview codeGen={currentItem.codeGenerated} />
          </div>
        </>
      ),
      renderAnswer: true,
    },
  ];
  const [tabs, setTabs] = React.useState(tabsInit);

  return (
    <div className="relative">
      <div className="rounded-md mt-4 p-4 border-[1px] border-[#eeeff1]">
        <div className="mb-4">
          <div className="flex flex-row justify-between items-center">
            <div className="flex items-center w-full">
              <div className="flex flex-row justify-center items-center">
                <button
                  className={`pl-2 pr-1 py-2 text-xs font-semibold rounded-md flex justify-center items-center
                  ${
                    currentCarouselIndex === 0 || selectedBookmarkMode
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'bg-white'
                  }
                  `}
                  onClick={goToPrevious}
                  disabled={currentCarouselIndex === 0 || selectedBookmarkMode}
                >
                  <FaAngleLeft className="w-3 h-3" />
                </button>
                <button
                  className={`pl-1 pr-2 py-2 mr-2 text-xs font-semibold rounded-md flex justify-center items-center
                  ${
                    currentCarouselIndex === items.length - 1 ||
                    selectedBookmarkMode
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'bg-white'
                  }
                  `}
                  onClick={goToNext}
                  disabled={
                    currentCarouselIndex === items.length - 1 ||
                    selectedBookmarkMode
                  }
                >
                  <FaAngleRight className="w-3 h-3" />
                </button>
              </div>
              <div className="w-full">
                <span className="text-sm">
                  {currentItem?.query === 'Generating...' ? (
                    <div className="w-full h-4 bg-white rounded-full dark:bg-[#eeeff1] animate-pulse"></div>
                  ) : (
                    currentItem?.query
                  )}
                </span>
              </div>
            </div>
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                  <span className="sr-only">Open options</span>
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    {['bar', 'doughnut', 'pie', 'line', 'scatter'].map(
                      (chartType) => (
                        <Menu.Item key={chartType}>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                'block px-4 py-2 text-sm',
                              )}
                              onClick={() => {
                                handleChartTypeChange(chartType);
                              }}
                            >
                              {chartType}
                            </a>
                          )}
                        </Menu.Item>
                      ),
                    )}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
        <Headings tabs={tabs} setTabs={setTabs} />
        <div className="border-t-[1px] mt-2 border-[#eeeff1]"></div>
        <div>
          {!currentItem || currentItem?.isGenerating ? (
            <QueriesGeneratingSkeleton />
          ) : (
            tabs.find((tab: any) => tab.current).component(currentItem)
          )}
        </div>
      </div>
      {!selectedBookmarkMode && (
        <div className="flex mt-4 justify-center items-center">
          {items.map((_, index) => (
            <Dot
              key={index}
              isActive={currentCarouselIndex === index}
              onClick={() => setCurrentCarouselIndex(index)}
            />
          ))}
        </div>
      )}

      <QueriesCustomDrawer isOpen={isDrawerOpen} onClose={handleDrawerClose} />
    </div>
  );
};

function QueryPreviewComingSoonBanner() {
  return (
    <div
      className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4"
      role="alert"
    >
      <p className="font-bold">Query Preview Coming Soon</p>
      <p>Stay tuned for updates</p>
    </div>
  );
}

function ChartChangerDropDown() {
  const { updateConversationItemChartType } = useQueriesState();
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div className="w-full justify-end">
        <Menu.Button className="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          <span className="sr-only">Open options</span>
          <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {['bar', 'doughnut', 'pie', 'line', 'scatter'].map((chartType) => (
              <Menu.Item key={chartType}>
                {({ active }) => (
                  <a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm',
                    )}
                    onClick={() => {
                      updateConversationItemChartType(chartType);
                    }}
                  >
                    {chartType}
                  </a>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default Carousel;
