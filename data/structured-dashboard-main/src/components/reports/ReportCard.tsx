import { getSourceIcon } from 'components/harbor/FileSystemTable';
import useReports from 'hooks/reports/useReports';
import React from 'react';
import { FaEllipsisV, FaFilePdf } from 'react-icons/fa';
import { LuPencilLine } from 'react-icons/lu';
import { TiDelete } from 'react-icons/ti';
import { uploaderEmailFormatter } from 'utils/formatters';
import { useAuthStore } from 'zustand/auth/authStore';
import { useConfirmationMessageStore } from '../../zustand/confirmationMessage/confirmationMessageStore';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import {
  CompleteReport,
  useReportsStore,
} from '../../zustand/reports/reportsStore';
import ErrorCard from './ErrorCard';
import ReportModal from './ReportModal';
import { IoLinkSharp } from "react-icons/io5";

interface ReportCardProps {
  report: CompleteReport;
  onOpenCompleteReportModal: (report: CompleteReport) => void;
  errorMessage: string | null;
  setIsCompleteReportModalOpen: (isOpen: boolean) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onOpenCompleteReportModal,
  errorMessage,
  setIsCompleteReportModalOpen,
}) => {
  const { user, isLoading: isUserLoading } = useAuthStore();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [showPdfContent, setShowPdfContent] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const { setConfirmationMessage } = useConfirmationMessageStore();

  const [showPdfModal, setShowPdfModal] = React.useState(false);

  const { onOpenDataViewModal } = useHarborStore();

  const setSelectedDataSource = useHarborStore(
    (state) => state.setSelectedDataSourceOnDataView,
  );

  const { deleteReport, copyReportLinkToClipboard } = useReports();

  const { pdfDownloadMode, setPdfDownloadMode, setOnViewMode } =
    useReportsStore();

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

  const toggleDropdown = () => {
    setShowDropdown((prevState) => !prevState);
  };

  const handleDeleteReport = async (event: React.MouseEvent) => {
    event.stopPropagation();
    await deleteReport(report.reportId);
    setShowDropdown(false);
  };

  const formatDate = (dateString: string) => {
    const today = new Date();
    const reportDate = new Date(dateString);

    if (
      today.getDate() === reportDate.getDate() &&
      today.getMonth() === reportDate.getMonth() &&
      today.getFullYear() === reportDate.getFullYear()
    ) {
      return 'Today';
    } else {
      const options: Intl.DateTimeFormatOptions = {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      };
      return reportDate.toLocaleDateString('en-US', options);
    }
  };

  if (report.isGenerating) {
    return (
      <ReportGeneratingSkeleton
        onOpenCompleteReportModal={onOpenCompleteReportModal}
        report={report}
      />
    );
  }

  return (
    <div
      className="border border-gray-300 rounded-lg p-6 pb-4 h-60 flex flex-col hover:bg-gray-50 cursor-pointer relative"
      onClick={(e) => {
        e.stopPropagation();

        setOnViewMode(true);
        setShowEditModal(true);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center">
        {report.reportDataSource ? (
          <div className="flex w-full items-center">
            <a
              className="flex flex-row items-center justify-start text-sm hover:bg-gray-200 max-w-fit pl-1 py-1 rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDataSource(report.reportDataSource);
                onOpenDataViewModal();
              }}
            >
              <div className="flex flex-row items-center justify-center mr-1 text-sm">
                <div className="flex flex-row items-center justify-center mr-3 text-sm">
                  {getSourceIcon(
                    report.reportDataSource?.fileMetadata?.source || 'csv',
                  )}
                </div>
                <div className="flex flex-col max-w-[13rem] truncate text-sm">
                  <span
                    className="truncate"
                    style={{
                      fontSize: '0.775rem',
                    }}
                  >
                    {report.reportDataSource?.name}
                  </span>
                  <hr className="border-t border-gray-200" />
                </div>
              </div>
            </a>
          </div>
        ) : (
          <p className="mt-1 font-bold text-sm flex items-center text-ellipsis">
            {report.overallReportName.replace(/^"|"$/g, '')}
          </p>
        )}
        {isHovered && (
          <button
            type="button"
            className="relative text-gray-500 rounded-full hover:bg-gray-200 p-2 transition duration-300 ease-in-out"
            onClick={(e) => {
              e.stopPropagation();
              toggleDropdown();
            }}
          >
            <FaEllipsisV size={12} />
          </button>
        )}
      </div>
      {showDropdown && (
        <div
          className="absolute top-12 right-6 bg-white border border-gray-300 rounded-md shadow-md z-10"
          ref={dropdownRef}
        >
          <button
            type="button"
            className="pl-2 pr-4 py-1 text-sm hover:bg-gray-100 w-full flex items-center justify-start gap-x-2"
            onClick={(e) => {
              e.stopPropagation();
              setShowEditModal(true);
              setShowDropdown(false);
            }}
          >
            <LuPencilLine className="ml-1 text-sm" />{' '}
            <span className="text-sm">Edit</span>
          </button>
          <button
            type="button"
            className="pl-2 pr-4 py-1 text-sm hover:bg-gray-100 w-full flex items-center justify-start gap-x-2"
            onClick={(e) => {
              e.stopPropagation();
              setPdfDownloadMode(true);
              setShowDropdown(false);
              onOpenCompleteReportModal(report);
            }}
          >
            <FaFilePdf className="ml-1 text-sm" />{' '}
            <span className="text-sm">PDF</span>
          </button>
          <button
            type="button"
            className="pl-2 pr-4 py-1 text-sm hover:bg-gray-100 w-full flex items-center justify-start gap-x-2 text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmationMessage(
                'Delete Report',
                'Are you sure you want to delete this report? This action cannot be undone.',
                async () => {
                  await handleDeleteReport(e);
                },
              );
            }}
          >
            <TiDelete className="ml-1 text-sm text-red-500" />{' '}
            <span className="text-sm text-red-500">Delete</span>
          </button>
          <button
            type="button"
            className="pl-2 pr-4 py-1 text-sm hover:bg-gray-100 w-full flex items-center justify-start gap-x-2"
            onClick={(e) => {
              e.stopPropagation();
              copyReportLinkToClipboard(report.reportId);
              setShowDropdown(false);
            }}
          >
            <IoLinkSharp className="ml-1 text-sm" />{' '}
            <span className="text-sm">Copy link</span>
          </button>
        </div>
      )}
      {errorMessage ? (
        <ErrorCard message={errorMessage} />
      ) : (
        report.reportDataSource && (
          <p className="mt-1 font-bold text-sm pt-4 flex items-center">
            {report.overallReportName.replace(/^"|"$/g, '')}
          </p>
        )
      )}
      <div className="mt-auto">
        <div className="border-t mt-2 pt-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="ml-2 font-medium text-xs text-gray-500">
              {isUserLoading
                ? 'Loading...'
                : report.uploaderEmail
                  ? uploaderEmailFormatter(report.uploaderEmail)
                  : 'Unknown User'}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {report.dateCreated ? formatDate(report.dateCreated) : 'No date'}
          </span>
        </div>
      </div>
      <ReportModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        completeReport={report}
      />
    </div>
  );
};

export function ReportGeneratingSkeleton({
  onOpenCompleteReportModal,
  report,
  className,
}: {
  onOpenCompleteReportModal?: (report: CompleteReport) => void;
  report?: CompleteReport;
  className?: string;
}) {
  return (
    <div
      className={`border border-gray-300 rounded-lg p-6 pb-4 h-60 flex flex-col hover:bg-gray-50 cursor-pointer relative animate-pulse ${className}`}
      onClick={() => onOpenCompleteReportModal(report)}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center w-full">
          <div className="rounded-full bg-gray-300 h-6 w-6 min-w-fit mr-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
        <div className="rounded-full bg-gray-300 h-6 w-6"></div>
      </div>
      <div className="mt-6 space-y-4">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
      <div className="mt-auto">
        <div className="border-t mt-2 pt-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="rounded-full bg-gray-300 h-6 w-6"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4 ml-2"></div>
          </div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}

export default ReportCard;
