import React, { useState } from 'react';
import { ReportDropdown } from './ReportDropdown';
import ReportsChart from './ReportsChart';
import KpiCardInfo from './KpiCardInfo';
import {
  CompleteReport,
  useReportsStore,
} from '../../zustand/reports/reportsStore';
import { TextBoxItem } from '../../zustand/reports/reportsStore';
import {
  QueryConversation,
  useQueriesState,
} from '../../zustand/queries/queriesStore';
import { v4 as uuidv4, v4 } from 'uuid';
import { useRouter } from 'next/navigation';
import useQueriesConversation from 'hooks/queries/useQueriesConversation';
import { useHarborStore } from 'zustand/harbor/harborStore';

interface QueryItemBoxProps {
  item: any;
  onViewMode?: boolean;
  completeReport: CompleteReport;
}

export const QueryItemBox: React.FC<QueryItemBoxProps> = ({
  item,
  onViewMode,
  completeReport,
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

  const handleMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const { setDrillingDownReport } = useReportsStore();

  const {
    setCurrentQueryConversation,
    addConversationToHistory,
    setCurrentCarouselIndex,
    setThreadsViewMode,
    updateConversationInHistory,
    queryConversationHistory,
  } = useQueriesState();

  const { initiateSaveQueryConversation } = useQueriesConversation();

  const [isDrillDownLoading, setIsDrillDownLoading] = useState('');

  const {
    setReportsChosenDataSource,
    setQueriesChosenDataSource,
    dataSources,
  } = useHarborStore();

  const router = useRouter();

  const handleDrillDown = async () => {
    setIsDrillDownLoading(item.queryReport?.id);
    setDrillingDownReport(true);

    const conversation = queryConversationHistory?.conversations.find((conv) =>
      conv.items.some((convItem) => convItem.id === item.id),
    );

    if (conversation) {
      setCurrentQueryConversation(conversation);

      let currQueryDs = dataSources.find(
        (dataSource) => dataSource.id === conversation.datasourceId,
      );

      setQueriesChosenDataSource(
        dataSources.find(
          (dataSource) => dataSource.id === conversation.datasourceId,
        ),
      );

      setReportsChosenDataSource(
        dataSources.find(
          (dataSource) => dataSource.id === conversation.datasourceId,
        ),
      );

      const itemIndex = conversation.items.findIndex(
        (convItem) => convItem.id === item.id,
      );
      setCurrentCarouselIndex(itemIndex);
    }

    router.push('/queries');
  };

  return (
    <div
      className="mt-4 rounded-md p-2 overflow-y-auto"
      style={{ height: '300px' }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-bold">{item.queryReport.reportName}</span>
        <ReportDropdown
          report={item.queryReport}
          onDrillDown={handleDrillDown}
          isLoading={false}
          onViewMode={onViewMode}
          itemId={item.id}
        />
      </div>
      <div>
        <p className="mb-4">
          <strong>Question:</strong> {item.queryReport.question}
        </p>
        <div className="mb-4">
          <strong>Answer:</strong> {item.queryReport.answer}
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
