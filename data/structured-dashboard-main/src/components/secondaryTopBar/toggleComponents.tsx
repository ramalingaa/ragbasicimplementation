'use client';

import { FaMagic, FaPlus } from 'react-icons/fa';
import { VscClose } from 'react-icons/vsc';
import useDeleteDataSources from '../../hooks/harbor/useDeleteDataSources';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useQueriesState } from '../../zustand/queries/queriesStore';
import {
  CompleteReport,
  useReportsStore,
} from '../../zustand/reports/reportsStore';
import { FaTableColumns, FaThreads } from 'react-icons/fa6';
import { useConfirmationMessageStore } from '../../zustand/confirmationMessage/confirmationMessageStore';
import { v4 as uuidv4 } from 'uuid';

export const ViewHideThreadsToggle = () => {
  const { threadsViewMode, setThreadsViewMode } = useQueriesState();

  return (
    <>
      <button
        className={`flex cursor-pointer items-center  justify-center h-[1.75rem] w-8
      border rounded-md rounded-br-md ${
        threadsViewMode == 'collapse'
          ? 'bg-black border-black'
          : 'bg-white text-white border-gray-300'
      }
      `}
        onClick={() => {
          if (threadsViewMode == 'collapse') {
            setThreadsViewMode('view');
          } else {
            setThreadsViewMode('collapse');
          }
        }}
      >
        <FaTableColumns
          className={`text-sm ${
            threadsViewMode == 'view' ? 'text-black' : 'text-white'
          }`}
        />
      </button>
    </>
  );
};

export const DeleteSourcesBtn = () => {
  const { errorMessage, isLoading, deleteDataSources } = useDeleteDataSources();
  const { selectedDataSources } = useHarborStore();

  const { setConfirmationMessage } = useConfirmationMessageStore();

  return (
    <button
      className="flex items-center justify-center text-sm px-2 rounded-md bg-red-btn-bg h-[1.75rem] text-white hover:bg-red-btn-hover border-red-btn-bg border-[1px] border-md transition duration-300 ease-in-out font-medium"
      onClick={() => {
        if (selectedDataSources.length === 1) {
          setConfirmationMessage(
            'Delete Data Source',
            'Are you sure you want to delete the selected data source? This action cannot be undone.',
            () => deleteDataSources(selectedDataSources),
          );
        } else {
          console.log(
            'Delete initiated on: ',
            selectedDataSources.map((ds) => ds.name).join(', '),
          );
          deleteDataSources(selectedDataSources);
        }
      }}
    >
      <VscClose className="mr-1 font-medium h-4 w-4" /> Delete
    </button>
  );
};

export const ReportsPageNewBtn = () => {
  const { setSelectedReport, setIsReportModalOpen, setReportBoxes } =
    useReportsStore();

  const { setReportsChosenDataSource } = useHarborStore();

  return (
    <button
      onClick={() => {
        const emptyReport: CompleteReport = {
          reportId: uuidv4(),
          overallReportName: '',
          setReportSummary: '',
          reports: [],
          isReportOpen: true,
          isEditingOverallName: false,
          reportDataSource: undefined,
          reportTemplate: undefined,
          isGenerating: false,
          errorMessage: undefined,
          dateCreated: undefined,
          uploaderEmail: undefined,
          embeddedQueryItems: [],
          reportBoxes: [],
        };
        setSelectedReport(emptyReport);
        setReportBoxes([]);
        setIsReportModalOpen(true);
      }}
      className="max-w-fit inline-flex w-full items-center text-white justify-center gap-x-1.5 rounded-md bg-blue-500 px-3 py-1 text-sm font-medium shadow-sm hover:bg-[#2064e4] border border-blue-500 h-[1.75rem]"
    >
      <FaPlus size={'0.75rem'} /> New
    </button>
  );
};

export const ImFeelingLuckyBtn = () => {
  return (
    <button
      onClick={() => {
        console.log("I'm feeling lucky!");
      }}
      className="max-w-fit inline-flex w-full items-center text-white justify-center gap-x-1.5 rounded-md bg-blue-500 px-3 py-1 text-sm font-medium shadow-sm hover:bg-[#2064e4] border border-blue-500 h-[1.75rem]"
    >
      <FaMagic size={'0.75rem'} /> I'm feeling lucky
    </button>
  );
};
