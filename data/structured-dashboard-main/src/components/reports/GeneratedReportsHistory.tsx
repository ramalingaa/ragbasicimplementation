'use client';

import React, { useRef, useState } from 'react';

import GeneratedReportContainer from './GeneratedReportContainer';
import { FaAngleUp, FaAngleDown, FaTrash } from 'react-icons/fa';

import ReactToPrint from 'react-to-print';
import { MdPrint } from 'react-icons/md';

import { useReportsStore } from '../../zustand/reports/reportsStore';
import useReports from 'hooks/reports/useReports';
import useFetchReports from 'hooks/reports/useFetchReports';
import DashboardContainer from 'components/dashboardContainer/DashboardContainer';
import DashboardHeadingWithDescription from 'components/dashboardHeadingWithDescription/DashboardHeadingWithDescription';
import Card from 'components/card/Card';

export default function GeneratedReportsHistory() {
  const {
    generatedReports,
    setGeneratedReports,
    setToggleReportIsOpen,
    toggleEditingOverallName,
    updateOverallReportName,
  } = useReportsStore();

  const handleToggleReportOpen = (reportId: string) => {
    setToggleReportIsOpen(reportId);
  };

  const { isLoading } = useFetchReports();

  const printRef = useRef(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const [selectedReport, setSelectedReport] = useState<string>('');

  const { deleteReport, updateCompleteReport } = useReports();

  const handleDeleteReport = () => {
    deleteReport(selectedReport);
    handleCloseModal();
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <DashboardHeadingWithDescription
        headingText="Reports History"
        hasDescription={false}
        descriptionText=""
        showLink={false}
      />
      {generatedReports.map((report) => (
        <div
          key={report.reportId}
          className="mb-4 border border-gray-300 rounded-md p-4 w-full"
        >
          <div className="flex justify-between items-center">
            <div className="flex">
              {report.isEditingOverallName ? (
                <input
                  className="lg size mr-2"
                  value={report.overallReportName}
                  onChange={(e) =>
                    updateOverallReportName(report.reportId, e.target.value)
                  }
                />
              ) : (
                <span className="font-bold">{report.overallReportName}</span>
              )}

              {report.isEditingOverallName ? (
                <button
                  className="text-brandColorScheme border border-brandColorScheme hover:bg-brandColorScheme hover:text-white active:bg-brandColorScheme focus:outline-none focus:ring focus:ring-brandColorScheme-dark rounded-md text-sm p-2.5 mr-2"
                  onClick={() => {
                    toggleEditingOverallName(report.reportId);
                    updateCompleteReport(report);
                  }}
                >
                  Save
                </button>
              ) : (
                <button
                  className="ml-2 mt-2 p-2.5 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brandColorScheme-light rounded-lg text-xs"
                  onClick={() => {
                    toggleEditingOverallName(report.reportId);
                  }}
                >
                  <MdPrint />
                </button>
              )}
            </div>

            <div className="flex">
              <div>
                <ReactToPrint
                  trigger={() => (
                    <button
                      className="ml-2 mt-2 p-2.5 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brandColorScheme-light rounded-lg text-xs"
                    >
                      <MdPrint />
                    </button>
                  )}
                  content={() => printRef.current}
                  documentTitle={`${report.overallReportName} Report`}
                />
              </div>

              <div className="mr-4">
                <button
                  onClick={() => {
                    setSelectedReport(report.reportId);
                    setIsModalOpen(true);
                    deleteReport(report.reportId);
                  }}
                  className="ml-2 mt-2 p-2.5 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brandColorScheme-light rounded-lg text-xs"
                >
                  <FaTrash />
                </button>
              </div>

              <button
                onClick={() => handleToggleReportOpen(report.reportId)}
                className="p-2.5 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brandColorScheme-light rounded-lg text-xs"
              >
                {report.isReportOpen ? <FaAngleUp /> : <FaAngleDown />}
              </button>
            </div>
          </div>
          {report.isReportOpen && (
            <div ref={printRef}>
              <GeneratedReportContainer
                reportSummary={report.setReportSummary}
                reports={report.reports}
              />
           

 </div>
          )}
        </div>
      ))}
      {generatedReports.length === 0 && <span>No generated reports yet</span>}
    </div>
  );
}
