import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { DataViewModalWrapper } from 'components/modal/ModalWrapper';
import useFetchDataSources from 'hooks/harbor/useFetchDataSources';
import React, { Fragment, useEffect, useState } from 'react';
import { FaFileCsv, FaHubspot, FaSalesforce, FaTable } from 'react-icons/fa';
import { TbBrandGoogleBigQuery } from 'react-icons/tb';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import TiptapEditor from './TiptapEditor';

import useUpdateReport from 'hooks/reports/useUpdateReport';
import { CompleteReport } from '../../zustand/reports/reportsStore';
import ReportsTemplatesDropdown from './ReportsTemplatesDropdown';
import ReportsChart from './ReportsChart';
import KpiCardInfo from './KpiCardInfo';
import { useAuthStore } from 'zustand/auth/authStore';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface ReportsCreationCustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  completeReport: CompleteReport;
}

const ReportsCreationCustomModal: React.FC<ReportsCreationCustomModalProps> = ({
  isOpen,
  onClose,
  completeReport,
}) => {
  const { dataSources, setReportsChosenDataSource, reportsChosenDataSource } =
    useHarborStore();
  const { errorMessage, isLoading } = useFetchDataSources();
  const { updateReport } = useUpdateReport();

  const [reportTitle, setReportTitle] = useState(
    completeReport.overallReportName || '',
  );
  const [reportQuestionsFocus, setReportQuestionsFocus] = useState(
    completeReport.setReportSummary || '',
  );

  useEffect(() => {
    if (isOpen) {
      setReportTitle(completeReport.overallReportName || '');
      setReportQuestionsFocus(completeReport.setReportSummary || '');
    }
  }, [isOpen]);

  const [hasTitleOrQuestionChanged, setHasTitleOrQuestionChanged] =
    React.useState(false);

  const handleDataSourceSelect = (dataSource: any) => {
    console.log('dataSource', dataSource);
    setReportsChosenDataSource(dataSource);
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'csv':
        return <FaFileCsv color="#ff943c" />;
      case 'salesforce':
        return <FaSalesforce className="text-blue-400" />;
      case 'spreadsheet':
        return <FaTable color="pink" />;
      case 'bigquery':
        return <TbBrandGoogleBigQuery color="blue" />;
      case 'hubspot':
        return <FaHubspot color="orange" />;
      default:
        return <FaTable color="gray" />;
    }
  };

  const handleTiptapUpdate = (
    updatedReportTitle: string,
    updatedReportQuestionsFocus: string,
  ) => {
    setReportTitle(updatedReportTitle);
    setReportQuestionsFocus(updatedReportQuestionsFocus);
    setHasTitleOrQuestionChanged(
      updatedReportTitle !== completeReport.overallReportName ||
        updatedReportQuestionsFocus !== completeReport.setReportSummary,
    );
  };

  const { user } = useAuthStore();

  const handleSave = async () => {
    const updatedCompleteReport: CompleteReport = {
      ...completeReport,
      overallReportName: reportTitle,
      setReportSummary: reportQuestionsFocus,
      ...(reportsChosenDataSource && {
        reportDataSource: reportsChosenDataSource,
      }),
      uploaderEmail: user?.email,
    };

    await updateReport(updatedCompleteReport);
    onClose();
  };

  const handleLucky = async () => {
    const updatedCompleteReport: CompleteReport = {
      ...completeReport,
      overallReportName: reportTitle,
      setReportSummary: reportQuestionsFocus,
      ...(reportsChosenDataSource && {
        reportDataSource: reportsChosenDataSource,
      }),
      uploaderEmail: user?.email,
    };

    await updateReport(updatedCompleteReport);
    onClose();
  };

  return (
    <DataViewModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Report"
      className="fixed inset-0 sm:w-[98%] sm:max-w-[98%] items-stretch"
      onSave={handleSave}
      showSaveButton={hasTitleOrQuestionChanged}
    >
      <div className="flex-1 w-full h-full flex flex-col">
        <Listbox
          value={reportsChosenDataSource || completeReport.reportDataSource}
          onChange={handleDataSourceSelect}
        >
          {({ open }) => (
            <>
              <div className="relative mt-6">
                <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6">
                  <span className="inline-flex w-full truncate">
                    <span className="truncate">
                      {reportsChosenDataSource
                        ? reportsChosenDataSource.name
                        : completeReport.reportDataSource?.name || 'Harbor'}
                    </span>
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
              </div>
            </>
          )}
        </Listbox>

        <div className="mt-4 flex-1">
          {/* <TiptapEditor
            reportTitle={reportTitle}
            reportQuestionsFocus={reportQuestionsFocus}
            reactComponentData={completeReport.embeddedQueryItems}
            onUpdate={handleTiptapUpdate}
          /> */}
        </div>

        {completeReport.reports.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {completeReport.reports.map((report, index) => (
              <div
                className="border-2 border-gray-100 rounded-md p-4"
                key={index}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold">{report.reportName}</span>
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
                      resultConnotation={report.kpiCardInfo.resultConnotation}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

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
