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
  useReportsStore,
} from '../../zustand/reports/reportsStore';
import { DataSourcesDropdown } from './DataSourcesDropdown';
import ReportsDragNDropContainer from './ReportsDragNDropContainer';
import { ReportTitleInput } from './ReportTitleInput';
import { QueryConversationItem } from 'zustand/queries/queriesStore';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface ReportsCreationCustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  getOverallReportNameStreamed: (
    reportTitle: string,
    reportQuestionsFocus: string,
  ) => void;
}

const ReportsCreationCustomModal: React.FC<ReportsCreationCustomModalProps> = ({
  isOpen,
  onClose,
  getOverallReportNameStreamed,
}) => {
  const { dataSources, setReportsChosenDataSource, reportsChosenDataSource } =
    useHarborStore();

  const { setReportCreationNoDataSourceSelected } = useReportsStore();
  const isLoading = false;
  // const { errorMessage, isLoading } = useFetchDataSources();
  const { saveReport } = useSaveReport();
  const { setConfirmationMessage } = useConfirmationMessageStore();

  const [isPandasAiActivated, setIsPandasAiActivated] = React.useState(false);
  const [reportTitle, setReportTitle] = useState('');
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

    getOverallReportNameStreamed(reportTitle, reportQuestionsFocus);
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
    console.log('SAVING:', embeddedQueryItems);
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1); // Add one day to the current date
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const newCompleteReport: CompleteReport = {
      reportId: uuidv4(),
      overallReportName: reportTitle || 'Untitled Report',
      setReportSummary: reportQuestionsFocus,
      reports: [],
      isReportOpen: false,
      dateCreated: formattedDate,
      ...(reportsChosenDataSource && {
        reportDataSource: reportsChosenDataSource,
      }),
      uploaderEmail: user?.email,
      ...(embeddedQueryItems && { embeddedQueryItems }),
      reportBoxes: useReportsStore.getState().reportBoxes,
    };

    saveReport(newCompleteReport);
    onClose();
  };

  const handleClose = () => {
    console.log('close');
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
    };

    useReportsStore
      .getState()
      .addChartBoxToReportBoxes('queryItem', item, layout);
  };

  return (
    <DataViewModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title="Create Report"
      className="fixed inset-0 sm:w-[98%] sm:max-w-[98%] items-stretch"
      // showAddChartButton={true}
      // onAddChart={addChartToReport}
    >
      <div className="flex-1 w-full h-full flex flex-col">
        <ReportTitleInput
          reportTitle={reportTitle}
          setReportTitle={setReportTitle}
          reportCreationNoTitleEntered={reportCreationNoTitleEntered}
        />

        <div className="mt-4 flex-1">{/* <ReportsDragNDropContainer /> */}</div>

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
    </DataViewModalWrapper>
  );
};

export default ReportsCreationCustomModal;
