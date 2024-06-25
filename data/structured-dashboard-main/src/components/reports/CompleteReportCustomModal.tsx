import styled from '@emotion/styled';
import { DataViewModalWrapper } from 'components/modal/ModalWrapper';
import useQueriesConversation from 'hooks/queries/useQueriesConversation';
import parse from 'html-react-parser';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { v4 } from 'uuid';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import {
  QueryConversation,
  useQueriesState,
} from '../../zustand/queries/queriesStore';
import { useReportsStore } from '../../zustand/reports/reportsStore';
import CompletePdfReport from './CompletePdfReport';
import KpiCardInfo from './KpiCardInfo';
import ReportsChart from './ReportsChart';

interface CompleteReportCustomModalProps {
  reportId: string;
  onClose: () => void;
  themeContainerBgColor: string;
  isOpen: boolean;
  pdfDownloadMode?: boolean;
}

const CompleteReportCustomModal: React.FC<CompleteReportCustomModalProps> = ({
  reportId,
  onClose,
  themeContainerBgColor,
  isOpen,
  pdfDownloadMode = false,
}) => {
  const { generatedReports } = useReportsStore();

  const completeReport = generatedReports.find(
    (report) => report.reportId === reportId,
  );

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
      id: v4(),
      conversationName: report.question,
      items: [
        {
          id: v4(),
          query: report.question,
          answer: report.answer,
          queryReport: report,
        },
      ],
      createdAt: new Date().toISOString(),
      datasourceId: completeReport.reportDataSource.id,
      unsaved: false,
    };

    setDrillingDownReport(true);
    await initiateSaveQueryConversation(
      newConversation,
      newConversation.items[0],
    );
    setReportsChosenDataSource(completeReport.reportDataSource);
    setQueriesChosenDataSource(completeReport.reportDataSource);

    setCurrentQueryConversation(newConversation);

    addConversationToHistory(newConversation);

    setCurrentCarouselIndex(0);

    router.push('/queries');

    // setIsDrillDownLoading('');
  };

  if (!completeReport) {
    console.error('Report not found:', reportId);
    return null;
  }

  const { overallReportName, setReportSummary, reports, isGenerating } =
    completeReport;

  const ModalContent = styled.div`
    &.pdf-padding {
      padding: 20px;
    }
  `;

  const handleExportPDF = async () => {
    const pdfContent = document.querySelector('.pdf-content');
    if (pdfContent) {
      const canvas = await html2canvas(pdfContent as HTMLElement, {
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();

      const contentWidth = canvas.width;
      const contentHeight = canvas.height;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = (pageWidth * contentHeight) / contentWidth;

      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
      pdf.save('report.pdf');
    }
  };

  return (
    <DataViewModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={overallReportName.replace(/^"|"$/g, '')}
      className="fixed inset-0 sm:w-[98%] sm:max-w-[98%]"
      showDownloadPDFButton={pdfDownloadMode}
      onDownloadPDF={handleExportPDF}
    >
      {pdfDownloadMode ? (
        <CompletePdfReport
          overallReportName={completeReport.overallReportName}
          setReportSummary={completeReport.setReportSummary}
          reports={completeReport.reports}
        />
      ) : (
        <div className="relative">
          <div className="modal-content">
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
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {isGenerating && reports.length === 0
                ? [...Array(4)].map((_, index) => (
                    <div
                      className="border-2 border-gray-100 rounded-md p-4"
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
                    <div className={`border-2 rounded-md p-4`} key={index}>
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
                              <>
                                <ReportsChart chartInfo={report.chartInfo} />
                              </>
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
        </div>
      )}
    </DataViewModalWrapper>
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
        className="relative text-gray-500"
        onClick={toggleDropdown}
      >
        <FaEllipsisV size={12} />
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

export default CompleteReportCustomModal;
