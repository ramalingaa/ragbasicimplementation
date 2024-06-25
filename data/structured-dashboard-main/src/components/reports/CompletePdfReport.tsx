import React from 'react';
import ReportsChart from './ReportsChart';
import KpiCardInfo from './KpiCardInfo';
import parse from 'html-react-parser';


interface CompletePdfReportProps {
  overallReportName: string;
  setReportSummary: string;
  reports: any[];
}

const CompletePdfReport: React.FC<CompletePdfReportProps> = ({
  overallReportName,
  setReportSummary,
  reports,
}) => {
  return (
    <div className="pdf-content p-8">
      <h2 className="text-2xl font-bold mb-4">
        {overallReportName.replace(/^"|"$/g, '')}
      </h2>
      <div className="mt-4 rounded-md p-4 border-2 border-gray-100 bg-white text-left whitespace-pre-line">
        {parse(setReportSummary)}
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
        {reports.map((report, index) => (
          <div className="border-2 border-gray-100 rounded-md p-4" key={index}>
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
                <>
                  <ReportsChart chartInfo={report.chartInfo} />
                </>
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
    </div>
  );
};

export default CompletePdfReport;
