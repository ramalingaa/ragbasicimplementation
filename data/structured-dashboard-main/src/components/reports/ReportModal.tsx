import { DataViewModalWrapper } from 'components/modal/ModalWrapper';
import useFetchDataSources from 'hooks/harbor/useFetchDataSources';
import React, { useEffect, useMemo, useState } from 'react';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import TiptapEditor from './TiptapEditor';

import useSaveReport from 'hooks/reports/useSaveReport';
import { v4 as uuidv4 } from 'uuid';
import { useAuthStore } from 'zustand/auth/authStore';
import { useConfirmationMessageStore } from '../../zustand/confirmationMessage/confirmationMessageStore';
import {
  CompleteReport,
  TextBoxItem,
  useReportsStore,
} from '../../zustand/reports/reportsStore';
import { DataSourcesDropdown } from './DataSourcesDropdown';
import ReportsDragNDropContainer from './ReportsDragNDropContainer';
import { ReportTitleInput } from './ReportTitleInput';
import AddBookmarkedQueryItemsChartsModal from './AddBookmarkedQueryItemsChartsModal';
import useUpdateReport from 'hooks/reports/useUpdateReport';
import ReportBoxesContainerViewMode from './ReportBoxesContainerViewMode';
import { QueryConversationItem } from 'zustand/queries/queriesStore';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  completeReport: CompleteReport;
  isCreatingReport?: boolean;
}

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  completeReport,
  isCreatingReport,
}) => {
  const { dataSources, setReportsChosenDataSource, reportsChosenDataSource } =
    useHarborStore();

  const {
    setReportCreationNoDataSourceSelected,
    isAddBookmarkedQueryItemsChartsModalOpen,
    setIsAddBookmarkedQueryItemsChartsModalOpen,
    reportBoxes,
    generatedReports,
    onViewMode,
    setOnViewMode,
  } = useReportsStore();
  const isLoading = false;
  // const { errorMessage, isLoading } = useFetchDataSources();
  const { saveReport } = useSaveReport();
  const { updateReport } = useUpdateReport();
  const { setConfirmationMessage } = useConfirmationMessageStore();

  const [isPandasAiActivated, setIsPandasAiActivated] = React.useState(false);
  const [reportTitle, setReportTitle] = useState(
    completeReport?.overallReportName || '',
  );
  const [reportCreationNoTitleEntered, setReportCreationNoTitleEntered] =
    useState(false);

  const [reportQuestionsFocus, setReportQuestionsFocus] = useState('');
  const [hasTitleOrQuestionChanged, setHasTitleOrQuestionChanged] =
    React.useState(false);

  useEffect(() => {
    if (isOpen) {
      setReportTitle('');
      setReportQuestionsFocus('');
    }
  }, [isOpen]);

  const handleDataSourceSelect = (dataSource: any) => {
    setReportsChosenDataSource(dataSource);
  };

  const handleCreateReport = async () => {
    if (!reportsChosenDataSource) {
      setReportCreationNoDataSourceSelected(true);
      return;
    }

    onClose();
  };

  const [embeddedQueryItems, setEmbeddedQueryItems] = useState<Array<{
    position: string;
    queryConversationItem: QueryConversationItem;
  }> | null>(null);

  const handleTiptapUpdate = (
    updatedReportTitle: string,
    updatedReportQuestionsFocus: string,
    reactComponentData: Array<{
      position: string;
      queryConversationItem: QueryConversationItem;
    }> | null,
  ) => {
    setReportTitle(updatedReportTitle);
    setReportQuestionsFocus(updatedReportQuestionsFocus);
    setEmbeddedQueryItems(reactComponentData);
    setHasTitleOrQuestionChanged(
      updatedReportTitle !== 'Untitled Report' ||
        updatedReportQuestionsFocus !==
          'Provide additional context for generating the report',
    );
  };

  const { user } = useAuthStore();

  const handleSave = async () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1); // Add one day to the current date
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const updatedCompleteReport: CompleteReport = {
      ...completeReport,
      overallReportName: reportTitle,
      setReportSummary: reportQuestionsFocus,
      uploaderEmail: user?.email,
      reportBoxes: reportBoxes,
      ...(reportsChosenDataSource && {
        reportDataSource: reportsChosenDataSource,
      }),
    };

    const existingReport = generatedReports.find(
      (report) => report.reportId === updatedCompleteReport.reportId,
    );

    if (existingReport) {
      console.log('!!!!!!!!!!!!');
      console.log('Updating report', updatedCompleteReport);
      console.log('!!!!!!!!!!!!');

      await updateReport(updatedCompleteReport);
    } else {
      console.log('!!!!!!!!!!!!');
      console.log('Saving report', updatedCompleteReport);
      console.log('!!!!!!!!!!!!');

      await saveReport({
        ...updatedCompleteReport,
        dateCreated: formattedDate,
      });
    }

    onClose();
  };

  const handleClose = () => {
    console.log('close');
    setOnViewMode(false);
    if (reportTitle === '' && reportQuestionsFocus === '') {
      setConfirmationMessage(
        'This report is empty',
        'Do you want to discard it?',
        onClose,
        false,
        'Discard',
        handleSave,
        'Keep',
      );
    } else {
      handleSave();
      onClose();
    }
  };

  const addChartToReport = (item: QueryConversationItem) => {
    // Perform the necessary actions to add the chart to the report
    console.log('Adding chart to report:', item);

    // Generate a unique identifier for the chart box
    const chartBoxId = `chartBox-${Date.now()}`;

    const layout = {
      i: chartBoxId,
      x: 0,
      y: 0,
      w: 5,
      h: 6,
      autoSize: true,
    };

    useReportsStore
      .getState()
      .addChartBoxToReportBoxes('queryItem', item, layout);
  };

  const onAddChart = () => {
    openAddBookmarkedQueryItemsChartsModal();
  };

  const addTextBoxToReport = () => {
    const textBoxItem: TextBoxItem = {
      id: uuidv4(),
      titleText: '',
      bodyText: '',
    };

    const layout = {
      i: textBoxItem.id,
      x: 0,
      y: 0,
      w: 5,
      h: 6,
    };

    useReportsStore
      .getState()
      .addTextBoxToReportBoxes('textBoxItem', textBoxItem, layout);
  };

  const openAddBookmarkedQueryItemsChartsModal = () => {
    setIsAddBookmarkedQueryItemsChartsModalOpen(true);
  };

  const closeAddBookmarkedQueryItemsChartsModal = () => {
    setIsAddBookmarkedQueryItemsChartsModalOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      setReportTitle(completeReport.overallReportName || '');
    }
  }, [isOpen]);

  return (
    <DataViewModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title={
        onViewMode
          ? completeReport?.overallReportName
          : isCreatingReport
          ? 'Create Report'
          : 'Edit Report'
      }
      className="fixed inset-0 sm:w-[98%] sm:max-w-[98%] items-stretch"
      showAddTileButton={!onViewMode}
      onAddChart={onAddChart}
      onAddTextBox={addTextBoxToReport}
    >
      <div className="flex-1 w-full h-full flex flex-col">
        {!onViewMode && (
          <ReportTitleInput
            reportTitle={reportTitle}
            setReportTitle={setReportTitle}
            reportCreationNoTitleEntered={reportCreationNoTitleEntered}
          />
        )}
        <div className="mt-4 flex-1">
          <ReportsDragNDropContainer
            savedReportBoxes={completeReport?.reportBoxes}
            onViewMode={onViewMode}
            completeReport={completeReport}
          />
        </div>
        {isLoading && (
          <div className="flex justify-center items-center h-50">
            <div
              className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
              role="status"
            >
              <span className="visually-hidden"></span>
            </div>
          </div>
        )}
      </div>
      <AddBookmarkedQueryItemsChartsModal
        isOpen={isAddBookmarkedQueryItemsChartsModalOpen}
        onClose={closeAddBookmarkedQueryItemsChartsModal}
        onAdd={addChartToReport}
      />
    </DataViewModalWrapper>
  );
};

export default ReportModal;
