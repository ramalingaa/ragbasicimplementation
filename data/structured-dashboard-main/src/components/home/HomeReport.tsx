'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import {
  QueryConversation,
  useQueriesState,
} from '../../zustand/queries/queriesStore';
import { useReportsStore } from '../../zustand/reports/reportsStore';

import KpiCardInfo from 'components/reports/KpiCardInfo';
import ReportsChart from 'components/reports/ReportsChart';
import useQueriesConversation from 'hooks/queries/useQueriesConversation';
import parse from 'html-react-parser';
import { useWorkspaceStore } from 'zustand/workspaces/workspaceStore';

const HomeReport: React.FC = () => {
  const { homeReport } = useReportsStore();
  const { currentWorkspace } = useWorkspaceStore();
  const logo = currentWorkspace?.WorkspaceLogo || null;
  const workspaceName = currentWorkspace?.WorkspaceName || '';

  const { setDrillingDownReport } = useReportsStore();

  const {
    setCurrentQueryConversation,
    addConversationToHistory,
    setCurrentCarouselIndex,
    setThreadsViewMode,
    updateConversationInHistory,
  } = useQueriesState();

  const { initiateSaveQueryConversation } = useQueriesConversation();

  const { setReportsChosenDataSource, setQueriesChosenDataSource } =
    useHarborStore();

  const router = useRouter();

  const [isDrillDownLoading, setIsDrillDownLoading] = React.useState('');

  const handleDrillDown = async (report: any) => {
    setIsDrillDownLoading(report.id);

    const newConversation: QueryConversation = {
      id: uuidv4(),
      conversationName: report.question,
      items: [
        {
          id: uuidv4(),
          query: report.question,
          answer: report.answer,
          queryReport: report,
        },
      ],
      createdAt: new Date().toISOString(),
      datasourceId: homeReport.reportDataSource.id,
      unsaved: false,
    };

    setDrillingDownReport(true);
    await initiateSaveQueryConversation(
      newConversation,
      newConversation.items[0],
    );
    setReportsChosenDataSource(homeReport.reportDataSource);
    setQueriesChosenDataSource(homeReport.reportDataSource);

    setCurrentQueryConversation(newConversation);

    addConversationToHistory(newConversation);

    setCurrentCarouselIndex(0);

    router.push('/queries');
  };

  if (!homeReport) {
    console.error('Home report not found');
    return null;
  }

  const { overallReportName, setReportSummary, reports, isGenerating } =
    homeReport;

  return (
    <div className="rounded-md p-6">
      <div className="flex items-center mb-2">
        {logo && (
          <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mr-4">
            <img
              className="h-full w-full object-cover"
              src={logo}
              alt="Workspace logo"
            />
          </div>
        )}
        <h2 className="text-2xl font-bold">
          {overallReportName !== 'Fetching available data sources...' && (
            <>
              {workspaceName} {overallReportName.replace(/^"|"$/g, '')}
            </>
          )}
          {overallReportName === 'Fetching available data sources...' && (
            <>{overallReportName}</>
          )}
        </h2>
      </div>
      {isGenerating && setReportSummary === '' ? (
        <div className="mt-4 rounded-md p-4 border-2 border-gray-100 bg-white animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      ) : setReportSummary ? (
        <div className="mt-4 rounded-md p-4 border-2 border-gray-100 bg-white text-left whitespace-pre-line">
          {parse(setReportSummary)}
        </div>
      ) : (
        <div className="mt-4 rounded-md p-4 border-2 border-gray-100 bg-white text-left">
          This report doesn't have a report summary yet.
        </div>
      )}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {isGenerating && reports.length === 0
          ? [...Array(6)].map((_, index) => (
              <div
                className="border-2 border-gray-100 rounded-md p-4 bg-white"
                key={index}
              >
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="flex items-center mb-4">
                    <div className="h-4 bg-gray-300 rounded w-1/4 mr-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="h-4 bg-gray-300 rounded w-1/4 mr-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  </div>
                  <div className="h-40 bg-gray-300 rounded mb-4"></div>
                </div>
              </div>
            ))
          : reports.map((report, index) => (
              <div
                className="border-2 border-gray-100 rounded-md p-4 bg-white"
                key={index}
              >
                {isGenerating && !report.answer ? (
                  <div className="animate-pulse">
                    <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div>
                      <p className="mb-4">
                        <strong>Question:</strong> {report.question}
                      </p>
                      <div className="flex items-center mb-4">
                        <div className="h-4 bg-gray-300 rounded w-1/4 mr-2"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      </div>
                      <div className="h-40 bg-gray-300 rounded mb-4"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold">
                        {report.reportName}
                      </span>
                      <ReportDropdown
                        report={report}
                        onDrillDown={handleDrillDown}
                        isLoading={isDrillDownLoading === report.id}
                      />
                    </div>
                    <div>
                      <p className="mb-4">
                        <strong>Question:</strong> {report.question}
                      </p>
                      <p className="mb-4">
                        <strong>Answer:</strong> {report.answer}
                      </p>
                      {report.chartInfo && (
                        <ReportsChart chartInfo={report.chartInfo} />
                      )}
                      {report.kpiCardInfo && (
                        <KpiCardInfo
                          title={report.kpiCardInfo.title}
                          resultEntity={report.kpiCardInfo.resultEntity}
                          result={report.kpiCardInfo.result}
                          resultConnotation={
                            report.kpiCardInfo.resultConnotation
                          }
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
      </div>
    </div>
  );
};

interface ReportDropdownProps {
  report: any;
  onDrillDown: (report: any) => void;
  isLoading: boolean;
}

const ReportDropdown: React.FC<ReportDropdownProps> = ({
  report,
  onDrillDown,
  isLoading,
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const toggleDropdown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowDropdown((prevState) => !prevState);
  };

  const handleDrillDownClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDrillDown(report);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="relative text-gray-500 opacity-0 hover:opacity-100 transition-opacity duration-200"
        onClick={toggleDropdown}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>
      {showDropdown && (
        <div
          className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10 min-w-[120px]"
          ref={dropdownRef}
        >
          <button
            type="button"
            className={`px-4 py-2 text-sm hover:bg-gray-100 w-full flex items-center justify-center ${
              isLoading ? 'cursor-not-allowed opacity-50' : ''
            }`}
            onClick={handleDrillDownClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
            ) : null}
            Drill Down
          </button>
        </div>
      )}
    </div>
  );
};

export default HomeReport;
