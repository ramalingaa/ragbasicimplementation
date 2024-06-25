'use client';

import { FaFileCsv, FaMagic } from 'react-icons/fa';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FaArrowRight, FaDatabase, FaQuestionCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { BsFileEarmarkSpreadsheetFill } from 'react-icons/bs';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useQueriesState } from '../../zustand/queries/queriesStore';
import QueriesCustomModal from './QueriesCustomModal';
import Carousel from './Carousel';
import useQueries from 'hooks/queries/useQueries';
import QueriesPageDataSourceSelectionDropDown from './QueriesCustomModal';
import { ReportGeneratingSkeleton } from 'components/reports/ReportCard';
import EmptyState from 'components/emptyState/EmptyState';
import { RxMagnifyingGlass } from 'react-icons/rx';
import { v4 } from 'uuid';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';
import { useReportsStore } from '../../zustand/reports/reportsStore';
import { VscDebugStart } from 'react-icons/vsc';
import useQueriesMagicFlow from 'hooks/queries/useQueriesMagicFlow';
import { Mention, MentionsInput } from 'react-mentions';
import mentionsInputStyle from './mentionsInputStyle';
import mentionStyle from './mentionStyle';

function Queries() {
  const [isFocused, setFocused] = useState(false);
  const {
    isLoading,
    error,
    dataSourceWarning,
    getQueriesReportPandasAiResults,
  } = useQueries();

  const { isLoading: queriesMagicFlowLoading, getQueriesMagicFlowQuery } =
    useQueriesMagicFlow();

  const { queriesChosenDataSource } = useHarborStore();

  const {
    setCurrentQueryConversation,
    setCurrentCarouselIndex,
    queriesTextAreaText,
    setQueriesTextAreaText,
    selectedBookmarkMode,
  } = useQueriesState();

  const router = useRouter();

  const [isDataSourceModalOpen, setDataSourceModalOpen] = useState(false);

  const openDataSourceModal = () => {
    setDataSourceModalOpen(true);
  };

  const closeDataSourceModal = () => {
    setDataSourceModalOpen(false);
  };

  const handleSubmit = async () => {
    let generatingInAnExistingConversation = false;
    if (currentQueryConversation) {
      generatingInAnExistingConversation = true;
    }
    if (generatingInAnExistingConversation) {
      setCurrentQueryConversation({
        ...currentQueryConversation,
        items: [
          ...currentQueryConversation.items,
          {
            id: v4(),
            query: queriesTextAreaText,
            answer: 'Generating...',
            queryReport: null,
            isGenerating: true,
            bookmarked: false,
          },
        ],
      });
      setCurrentCarouselIndex(currentQueryConversation.items.length);
    } else {
      setCurrentQueryConversation({
        id: v4(),
        conversationName: 'Query',
        items: [
          {
            id: v4(),
            query: queriesTextAreaText,
            answer: 'Generating...',
            queryReport: null,
            isGenerating: true,
            bookmarked: false,
          },
        ],
      });
    }
    await getQueriesReportPandasAiResults(queriesTextAreaText).finally(() => {
      setProgress(0);
    });
  };

  const handleSubmitMagicFlow = async () => {
    let generatingInAnExistingConversation = false;
    if (currentQueryConversation) {
      generatingInAnExistingConversation = true;
    }
    if (generatingInAnExistingConversation) {
      setCurrentQueryConversation({
        ...currentQueryConversation,
        items: [
          ...currentQueryConversation.items,
          {
            id: v4(),
            query: 'Generating...',
            answer: 'Generating...',
            queryReport: null,
            isGenerating: true,
            bookmarked: false,
          },
        ],
      });
      setCurrentCarouselIndex(currentQueryConversation.items.length);
    } else {
      setCurrentQueryConversation({
        id: v4(),
        conversationName: 'Magic Flow Query',
        items: [
          {
            id: v4(),
            query: 'Generating...',
            answer: 'Generating...',
            queryReport: null,
            isGenerating: true,
            bookmarked: false,
          },
        ],
      });
    }
    await getQueriesMagicFlowQuery().finally(() => {
      setProgress(0);
    });
  };

  const handleKeyPress = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (!showTypeahead && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (queriesTextAreaText === '') {
        return;
      }
      setFocused(false);
      await handleSubmit();
    }
  };

  const handleFetchData = async () => {
    if (queriesTextAreaText === '') {
      return;
    }
    setFocused(false);
    await handleSubmit();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading || queriesMagicFlowLoading) {
      setProgress(0); // Start the progress from zero
      interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 99) {
            clearInterval(interval);
            return 99; // Or reset to 0 if needed
          }
          return oldProgress + 1;
        });
      }, 500);
    }

    return () => {
      clearInterval(interval);
      // If needed, reset progress when the component unmounts or isLoading changes
      if (!isLoading && !queriesMagicFlowLoading) {
        setProgress(0);
      }
    };
  }, [isLoading, queriesMagicFlowLoading]);

  const [inTextArea, setInTextArea] = useState(false);
  const flexRef = useRef<HTMLDivElement>(null);
  const samplePromptsRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      flexRef.current &&
      !flexRef.current.contains(event.target as Node) &&
      !(
        samplePromptsRef.current &&
        samplePromptsRef.current.contains(event.target as Node)
      )
    ) {
      setInTextArea(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const {
    reportsChosenDataSource,
    setQueriesChosenDataSource,
    setReportsChosenDataSource,
  } = useHarborStore();

  const { currentQueryConversation } = useQueriesState();
  const [progress, setProgress] = useState(0);

  // SVG circle configuration
  const radius = 15;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const [disableQueryInput, setDisableQueryInput] = useState(false);

  useEffect(() => {
    if (
      isLoading ||
      queriesMagicFlowLoading ||
      !queriesChosenDataSource ||
      selectedBookmarkMode
    ) {
      setDisableQueryInput(true);
    } else {
      setDisableQueryInput(false);
    }
  }, [
    isLoading,
    queriesChosenDataSource,
    queriesMagicFlowLoading,
    selectedBookmarkMode,
  ]);

  const { currentWorkspace } = useWorkspaceStore();

  const { drillingDownReport, setDrillingDownReport } = useReportsStore();

  useEffect(() => {
    if (drillingDownReport) {
      // currentQueryConversation
      setDrillingDownReport(false);
    } else {
      setCurrentQueryConversation(null);
      setQueriesChosenDataSource(null);
      setReportsChosenDataSource(null);
    }
  }, [currentWorkspace?.WorkspaceID]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ left: 0, top: 0 });

  const handleTextAreaClick = (e: any) => {
    const { left, top } = e.target.getBoundingClientRect();
    const cursorLeft = e.clientX - left + e.target.scrollLeft;
    const cursorTop = e.clientY - top + e.target.scrollTop;
    setCursorPosition({ left: cursorLeft, top: cursorTop });
    setInTextArea(true);
  };

  const [selectedColumnIndex, setSelectedColumnIndex] = useState(-1);

  const [showTypeahead, setShowTypeahead] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [filteredColumns, setFilteredColumns] = useState<string[]>(
    queriesChosenDataSource?.fileMetadata?.schema.map(
      (column: any) => column.columnName,
    ),
  );
  const [mentionsValue, setMentionsValue] = useState('');

  useEffect(() => {
    setFilteredColumns(
      queriesChosenDataSource?.fileMetadata?.schema.map(
        (column: any) => column.columnName,
      ),
    );
    setMentionsValue('');
  }, [queriesChosenDataSource]);

  const handleTextAreaChange = (e: any) => {
    const value = e.target.value;
    setQueriesTextAreaText(value);

    const textarea = e.target;
    const caretPosition = textarea.selectionStart;
    const text = textarea.value.substring(0, caretPosition);
    const lines = text.split('\n');

    const textBeforeCaret = text.substring(0, caretPosition);
    const textLines = textBeforeCaret.split('\n');
    const currentLineText = textLines[textLines.length - 1];

    const range = document.createRange();
    const textNode = document.createTextNode(currentLineText);
    const span = document.createElement('span');
    span.appendChild(textNode);
    span.style.position = 'absolute';
    span.style.visibility = 'hidden';
    span.style.whiteSpace = 'pre';
    textarea.parentNode.insertBefore(span, textarea);

    range.setStart(textNode, currentLineText.length);
    range.setEnd(textNode, currentLineText.length);

    const rect = range.getBoundingClientRect();
    const cursorLeft = rect.right - textarea.getBoundingClientRect().left;
    const cursorTop = (textLines.length - 1) * 20; // Adjust the line height as needed

    span.parentNode.removeChild(span);

    setCursorPosition({ left: cursorLeft, top: cursorTop });

    if (value.includes('@')) {
      const lastAtIndex = value.lastIndexOf('@');
      const query = value.slice(lastAtIndex + 1);
      const columns = queriesChosenDataSource?.fileMetadata?.schema.map(
        (column: any) => column.columnName,
      );

      const filteredColumns = columns.filter((column: any) =>
        column.toLowerCase().includes(query.toLowerCase()),
      );

      setFilteredColumns(filteredColumns);
      setShowTypeahead(true);
      setSelectedColumnIndex(-1);
    } else {
      setShowTypeahead(false);
    }
  };

  const handleKeyDown = (e: any) => {
    if (showTypeahead) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedColumnIndex((prevIndex) =>
          prevIndex < filteredColumns.length - 1 ? prevIndex + 1 : prevIndex,
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedColumnIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedColumnIndex !== -1) {
          handleColumnSelect(filteredColumns[selectedColumnIndex]);
        }
      }
    }
  };

  const handleColumnSelect = (column: string) => {
    const lastAtIndex = queriesTextAreaText.lastIndexOf('@');
    const textBeforeAt = queriesTextAreaText.slice(0, lastAtIndex);
    const textAfterAt = queriesTextAreaText.slice(lastAtIndex + 1);
    const newText = `${textBeforeAt}[${column}]${textAfterAt}`;

    setQueriesTextAreaText(newText);
    setSelectedColumns([...selectedColumns, column]);
    setShowTypeahead(false);
  };

  const handleColumnRemove = (column: any) => {
    setSelectedColumns(selectedColumns.filter((c) => c !== column));

    // Remove the column from the textarea
    const newText = queriesTextAreaText.replace(`[${column}]`, '');
    setQueriesTextAreaText(newText);
  };

  const handleMentionsKeyDown = async (
    event:
      | React.KeyboardEvent<HTMLTextAreaElement>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (queriesTextAreaText === '') {
        return;
      }
      setFocused(false);
      await handleSubmit();
    }
  };

  return (
    <div className="w-full overflow-y-scroll h-full">
      <div
        className="flex flex-col w-full relative border border-[#eeeff1] rounded-md"
        ref={flexRef}
      >
        <MentionsInput
          placeholder="Ask Structured Questions..."
          value={mentionsValue}
          onChange={(e, newValue, newPlainTextValue, mentions) => {
            setMentionsValue(newValue);
            setQueriesTextAreaText(newPlainTextValue);
            setSelectedColumns(mentions.map((mention) => mention.display));
          }}
          style={mentionsInputStyle}
          a11ySuggestionsListLabel={'Suggested mentions'}
          disabled={disableQueryInput}
          // onFocus={() => setFocused(true)}
          // onKeyPress={handleKeyPress}
          // onClick={() => setInTextArea(true)}
          onKeyDown={handleMentionsKeyDown}
          aria-disabled={disableQueryInput}
        >
          <Mention
            style={mentionStyle}
            data={
              filteredColumns
                ? filteredColumns.map((column) => ({
                    id: column,
                    display: column,
                  }))
                : []
            }
            trigger={'@'}
            onAdd={(id, display) => {
              setSelectedColumns((prevColumns) => [
                ...new Set([...prevColumns, display]),
              ]);
            }}
          />
        </MentionsInput>

        {/* <textarea
          className="flex-grow p-4 resize-none focus:outline-none focus:shadow-none rounded-tl-md rounded-tr-md"
          value={queriesTextAreaText}
          onChange={handleTextAreaChange}
          placeholder={
            queriesMagicFlowLoading || isLoading
              ? ''
              : 'Ask Structured Questions...'
          }
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyPress={handleKeyPress}
          onClick={() => setInTextArea(true)}
          disabled={disableQueryInput}
          onKeyDown={handleKeyDown}
          ref={textareaRef}
        /> */}
        {/* {showTypeahead && (
          <div
            className="absolute bg-white border border-gray-300 rounded shadow-sm z-10 max-h-40 overflow-y-auto"
            style={{
              left: cursorPosition.left,
              top: cursorPosition.top + 44, // Adjust the offset as needed
            }}
          >
            {filteredColumns.map((column, index) => (
              <div
                key={index}
                className={`px-2 py-1 cursor-pointer text-xs ${index === selectedColumnIndex
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-100'
                  }`}
                onClick={() => handleColumnSelect(column)}
              >
                {column}
              </div>
            ))}
          </div>
        )} */}
        {/* <div className="flex flex-wrap p-2">
          {selectedColumns.map((column, index) => (
            <Badge
              key={index}
              value={column}
              onRemove={() => handleColumnRemove(column)}
            />
          ))}
        </div> */}
        <div className={`flex justify-between p-2 items-center`}>
          <div className="flex items-center space-x-1 w-full">
            <CurrentThreadsDataSourcebadge
              queriesChosenDataSource={queriesChosenDataSource}
              onRemove={() => {
                setQueriesChosenDataSource(null);
              }}
            />
          </div>

          <div className="flex items-center space-x-1">
            {!isLoading && (
              <div className="relative group inline-block">
                <button
                  className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 whitespace-nowrap"
                  style={{ height: '24px' }}
                  onClick={handleSubmitMagicFlow}
                  disabled={disableQueryInput}
                >
                  {queriesMagicFlowLoading ? (
                    <div className="flex justify-center items-center space-x-2">
                      <div className="relative">
                        <svg
                          className="transform -rotate-90 w-4 h-4"
                          viewBox="0 0 60 60"
                        >
                          <circle
                            stroke="#000000"
                            fill="transparent"
                            strokeWidth="4"
                            strokeDasharray={`${circumference} ${circumference}`}
                            style={{ strokeDashoffset: circumference }}
                            r={radius}
                            cx="30"
                            cy="30"
                          />
                          <circle
                            stroke="#000000"
                            fill="transparent"
                            strokeWidth="4"
                            strokeDasharray={`${circumference} ${circumference}`}
                            style={{ strokeDashoffset: offset }}
                            r={radius}
                            cx="30"
                            cy="30"
                          />
                        </svg>
                      </div>
                      <span className="text-xs">{progress.toFixed(0)}%</span>
                    </div>
                  ) : (
                    <FaMagic style={{ fontSize: '12px' }} />
                  )}
                </button>
                {!disableQueryInput && (
                  <div className="absolute left-1/2 top-full mt-2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap z-10">
                    I'm feeling lucky! ✨
                  </div>
                )}
                {!queriesChosenDataSource && (
                  <div
                    className="absolute left-1/2 top-full mt-2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 z-10"
                    style={{ width: '120px', whiteSpace: 'normal' }}
                  >
                    Query thread does not have a data source
                  </div>
                )}
              </div>
            )}

            {!queriesMagicFlowLoading && (
              <div className="relative group inline-block">
                <button
                  aria-label="Search"
                  className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                    isLoading
                      ? 'bg-blue-500 text-white'
                      : 'bg-green-600 text-white'
                  }`}
                  onClick={handleFetchData}
                  disabled={disableQueryInput}
                  style={{ height: '24px' }}
                >
                  {isLoading ? (
                    <div className="flex justify-center items-center space-x-2">
                      <div className="relative">
                        <svg
                          className="transform -rotate-90 w-4 h-4"
                          viewBox="0 0 60 60"
                        >
                          <circle
                            stroke="#ffffff"
                            fill="transparent"
                            strokeWidth="4"
                            strokeDasharray={`${circumference} ${circumference}`}
                            style={{ strokeDashoffset: circumference }}
                            r={radius}
                            cx="30"
                            cy="30"
                          />
                          <circle
                            stroke="#ffffff"
                            fill="transparent"
                            strokeWidth="4"
                            strokeDasharray={`${circumference} ${circumference}`}
                            style={{ strokeDashoffset: offset }}
                            r={radius}
                            cx="30"
                            cy="30"
                          />
                        </svg>
                      </div>
                      <span className="text-xs">{progress.toFixed(0)}%</span>
                    </div>
                  ) : (
                    <>
                      <VscDebugStart
                        className="text-white mr-1"
                        style={{ fontSize: '12px' }}
                      />
                      <span style={{ fontSize: '12px' }}>Run</span>
                    </>
                  )}
                </button>
                {!queriesChosenDataSource && (
                  <div
                    className="absolute right-0 top-full mt-2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 z-10"
                    style={{ width: '120px', whiteSpace: 'normal' }}
                  >
                    Query thread does not have a data source
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div
          className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p className="font-bold">There was an error creating the report</p>
          <p>{error}</p>
        </div>
      )}

      {currentQueryConversation &&
        currentQueryConversation.items &&
        currentQueryConversation.items.length !== 0 && (
          <Carousel
            currentQueryConversation={currentQueryConversation}
            items={currentQueryConversation.items}
          />
        )}

      {(currentQueryConversation &&
        (!currentQueryConversation.items ||
          currentQueryConversation.items.length === 0)) ||
        (!(
          currentQueryConversation &&
          currentQueryConversation.items &&
          currentQueryConversation.items.length !== 0
        ) &&
          !queriesChosenDataSource && <NoThreadsUI />)}
    </div>
  );
}

interface BadgeProps {
  value: string;
  onRemove: () => void;
}

function Badge({ value, onRemove }: BadgeProps) {
  return (
    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mr-2 mb-2">
      {value}
      <button
        className="ml-1 flex-shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={onRemove}
      >
        <span className="sr-only">Remove</span>
        <svg
          className="h-3 w-3 text-blue-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </span>
  );
}

function CurrentThreadsDataSourcebadge({
  queriesChosenDataSource,
  onRemove,
}: {
  queriesChosenDataSource: any;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
      {queriesChosenDataSource
        ? queriesChosenDataSource.name
        : 'No Data Source Selected'}
      {queriesChosenDataSource && (
        <button
          className="ml-1 flex-shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={onRemove}
        >
          <span className="sr-only">Remove</span>
          <svg
            className="h-3 w-3 text-blue-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
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
    </span>
  );
}

export function QueriesGeneratingSkeleton() {
  return (
    <div
      className={`border border-[#eeeff1] rounded-lg px-6 py-2 pb-4 h-60 flex flex-col cursor-pointer relative animate-pulse mt-4`}
    >
      <div className="flex justify-between items-center mt-4">
        <p
          className="h-4 bg-white rounded-full dark:bg-[#eeeff1]"
          style={{ width: '40%' }}
        ></p>
        <div
          className="h-4 bg-white rounded-full dark:bg-[#eeeff1]"
          style={{ width: '20%' }}
        ></div>
      </div>
      <ul className="mt-8 space-y-5 flex flex-col items-stretch h-full">
        <li className="w-full h-4 bg-white rounded-full dark:bg-[#eeeff1]"></li>
        <li className="w-full h-4 bg-white rounded-full dark:bg-[#eeeff1]"></li>
        <li className="w-full h-4 bg-white rounded-full dark:bg-[#eeeff1]"></li>
      </ul>
    </div>
  );
}

function NoThreadsUI() {
  return (
    <div className="h-72 mt-4 flex items-center w-full rounded-md border-[#eeeff1] border-[1px]">
      <EmptyState
        title="No Selected Query"
        desciption="Get started by asking a question."
        icon={<RxMagnifyingGlass className="mx-auto h-12 w-12 text-gray-400" />}
      />
    </div>
  );
}

export default Queries;
