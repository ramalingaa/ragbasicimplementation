import React from 'react';
import { ReportDropdown } from './ReportDropdown';
import ReportsChart from './ReportsChart';
import KpiCardInfo from './KpiCardInfo';

interface EmbeddedQueryItemProps {
  item: any;
  index: number;
  isDrillDownLoading: string;
  handleDrillDown: (report: any) => void;
}

export const EmbeddedQueryItem: React.FC<EmbeddedQueryItemProps> = ({
  item,
  index,
  isDrillDownLoading,
  handleDrillDown,
}) => {
  const renderAnswer = () => {
    if (Array.isArray(item.answer)) {
      return (
        <ul>
          {item.answer.map((answerItem: any, answerIndex: number) => (
            <li key={answerIndex}>
              {Object.entries(answerItem).map(([key, value]) => (
                <span key={key}>
                  {key}: {String(value)}
                </span>
              ))}
            </li>
          ))}
        </ul>
      );
    } else {
      return <p>{item.answer}</p>;
    }
  };

  return (
    <div
      key={index}
      className="mt-4 rounded-md p-4 border-2 border-gray-100 bg-white"
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-bold">{item.queryReport.reportName}</span>
        <ReportDropdown
          report={item.queryReport}
          onDrillDown={handleDrillDown}
          isLoading={isDrillDownLoading === item.id}
        />
      </div>
      <div>
        <p className="mb-4">
          <strong>Question:</strong> {item.queryReport.question}
        </p>
        <div className="mb-4">
          <strong>Answer:</strong> {renderAnswer()}
        </div>
        {item.queryReport.chartInfo && (
          <>
            <ReportsChart chartInfo={item.queryReport.chartInfo} />
          </>
        )}
        {item.queryReport.kpiCardInfo && (
          <KpiCardInfo
            title={item.queryReport.kpiCardInfo.title}
            resultEntity={item.queryReport.kpiCardInfo.resultEntity}
            result={item.queryReport.kpiCardInfo.result}
            resultConnotation={item.queryReport.kpiCardInfo.resultConnotation}
          />
        )}
      </div>
    </div>
  );
};
