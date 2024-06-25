'use client';
import React, { useEffect } from 'react';
import {
  CompleteReport,
  useReportsStore,
} from '../../zustand/reports/reportsStore';
import { useAuthStore } from 'zustand/auth/authStore';
import useFetchReports from 'hooks/reports/useFetchReports';
import ReportsCreationCustomModal from './ReportsCreationCustomModal';
import CompleteReportCustomModal from './CompleteReportCustomModal';
import useReports from 'hooks/reports/useReports';
import EmptyState from 'components/emptyState/EmptyState';
import ReportCard from './ReportCard';
import { useConfirmationMessageStore } from '../../zustand/confirmationMessage/confirmationMessageStore';
import ReportModal from './ReportModal';
import { useWorkspaceStore } from 'zustand/workspaces/workspaceStore';
import { useNotificationStore } from 'zustand/notification/notificationStore';
import { useSearchParams } from 'next/navigation';

const ReportsContainer: React.FC = () => {
  const { setConfirmationMessage } = useConfirmationMessageStore();

  const {
    generatedReports,
    selectedReport,
    setSelectedReport,
    isReportModalOpen,
    setIsReportModalOpen,
  } = useReportsStore();
  const { user, isLoading: isUserLoading } = useAuthStore();
  const { isLoading: isReportsLoading } = useFetchReports();
  const { isReportCreationModalOpen, setIsReportCreationModalOpen } =
    useReportsStore();

  const [showDropdown, setShowDropdown] = React.useState<string | null>(null);

  const { getOverallReportNameStreamed } = useReports();

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const {
    pdfDownloadMode,
    setPdfDownloadMode,
    selectedReportId,
    setSelectedReportId,
    isCompleteReportModalOpen,
    setIsCompleteReportModalOpen,
    setOnViewMode,
  } = useReportsStore();

  // URL PARAMS HANDLING

  const { currentWorkspace } = useWorkspaceStore();
  const { availableWorkspaces, setCurrentWorkspace } = useWorkspaceStore();
  const { setNotificationState } = useNotificationStore();
  const searchParams = useSearchParams()
  const [searchedUrlParams, setSearchedUrlParams] = React.useState<boolean>(false);

  useEffect(() => {
    console.log("===========%%===========%%");
    if (currentWorkspace && availableWorkspaces.length && !searchedUrlParams) {
      const reportId = searchParams.get('reportId');
      const workspaceId = searchParams.get('workspaceId');
      console.log('workspaceId', workspaceId, "reportId", reportId);
      if (workspaceId && availableWorkspaces.length > 0) {
        const workspace = availableWorkspaces.find((w) => w.WorkspaceID === workspaceId);
        if (workspace) {
          setCurrentWorkspace(workspace);
          // remove only workspaceId from the URL
          const newUrl = window.location.href.replace(`workspaceId=${workspaceId}`, '');
          window.history.replaceState({}, '', newUrl);
        } else {
          setNotificationState(true, 'User does not have access to this Workspace Thread', 'failure');
          return;
        }
      }

      if (reportId) {
        const report = generatedReports.find(
          (report) => report.reportId === reportId,
        );

        if (report) {
          // 
          setSelectedReport(report);
          setTimeout(() => { setIsReportModalOpen(true), setOnViewMode(true) }, 100);
          const newUrl = window.location.href.replace(`reportId=${report.reportId}`, '');
          window.history.replaceState({}, '', newUrl);
          setSearchedUrlParams(true);
        } else {
          // setNotificationState(true, 'Thread not found', 'failure')
        }
      }

      // if url ends with ?& remove the last ? from the url
      if (window.location.href.endsWith('?&')) {
        const newUrl = window.location.href.replace('?&', '');
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [currentWorkspace, generatedReports]);

  // END URL PARAMS HANDLING


  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(null);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const { deleteReport } = useReports();

  if (isReportsLoading) {
    return (
      <div className="mt-4 py-4 flex justify-center items-center h-full">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-gray-600"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  const openCompleteReportModal = (reportId: string) => {
    setSelectedReportId(reportId);
    setIsCompleteReportModalOpen(true);
  };

  const closeCompleteReportModal = () => {
    setSelectedReport(null);
    setPdfDownloadMode(false);
    setIsCompleteReportModalOpen(false);
  };

  const toggleDropdown = (reportId: string) => {
    setShowDropdown((prevReportId) =>
      prevReportId === reportId ? null : reportId,
    );
  };

  const handleDeleteReport = async (reportId: string) => {
    await deleteReport(reportId);
    setShowDropdown(null);
  };

  return (
    <>
      <div
        className={`${generatedReports.length === 0
          ? 'h-full w-full'
          : 'grid grid-cols-3 gap-6'
          }`}
      >
        {generatedReports.length === 0 ? (
          <EmptyState
            title="No reports"
            desciption="Get started by creating a new report."
          />
        ) : (
          generatedReports
            .sort((a, b) => {
              if (a.dateCreated && b.dateCreated) {
                return (
                  new Date(b.dateCreated).getTime() -
                  new Date(a.dateCreated).getTime()
                );
              }
              return 0;
            })
            .map((report) => (
              <ReportCard
                key={report.reportId}
                report={report}
                onOpenCompleteReportModal={() =>
                  openCompleteReportModal(report.reportId)
                }
                errorMessage={report?.errorMessage}
                setIsCompleteReportModalOpen={setIsCompleteReportModalOpen}
              />
            ))
        )}
      </div>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        completeReport={selectedReport}
        isCreatingReport={true}
      />

      {selectedReportId && (
        <CompleteReportCustomModal
          reportId={selectedReportId}
          onClose={closeCompleteReportModal}
          themeContainerBgColor="gray.50"
          isOpen={isCompleteReportModalOpen}
          pdfDownloadMode={pdfDownloadMode}
        />
      )}
    </>
  );
};

export default ReportsContainer;
