import { NodeViewWrapper } from '@tiptap/react';
import useQueriesConversation from 'hooks/queries/useQueriesConversation';
import { useRouter } from 'next/navigation';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DataSource } from '../../interfaces/DataTypes';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import {
  QueryConversation,
  QueryConversationItem,
  useQueriesState,
} from '../../zustand/queries/queriesStore';
import { useReportsStore } from '../../zustand/reports/reportsStore';

import KpiCardInfo from './KpiCardInfo';
import ReportsChart from './ReportsChart';
import { ReportDropdown } from './ReportDropdown';
import { ChartInfo } from './GeneratedReportContainer';


type Report = {
  reportName: string;
  question: string;
  answer: string;
  chartInfo?: ChartInfo;
  isEditing?: boolean;
  reportLoading?: boolean;
  reportPopulated?: boolean;
  reportReloading?: boolean;
  reportDataSource?: DataSource;
  id?: string;
  kpiCardInfo?: {
    title: string;
    resultEntity: string;
    result: string;
    resultConnotation: string;
  };
};

type TipTapComponentProps = {
  queryConversationItem: QueryConversationItem;
};

const TipTapComponent = (props: any) => {
  const { node } = props;
  const queryConversationItem = node.attrs.queryConversationItem;
  const parsedQueryConversationItem = queryConversationItem
    ? JSON.parse(queryConversationItem)
    : null;

  const { setDrillingDownReport } = useReportsStore();
  const {
    setCurrentQueryConversation,
    addConversationToHistory,
    setCurrentCarouselIndex,
    setThreadsViewMode,
    updateConversationInHistory,
  } = useQueriesState();
  const { initiateSaveQueryConversation } = useQueriesConversation();
  const { setReportsChosenDataSource, setQueriesChosenDataSource } =
    useHarborStore();
  const router = useRouter();

  const [isDrillDownLoading, setIsDrillDownLoading] = React.useState('');

  const handleDrillDown = async (report: any) => {
    setIsDrillDownLoading(report.id);

    const newConversation: QueryConversation = {
      id: uuidv4(),
      conversationName: report.question,
      items: [
        {
          id: uuidv4(),
          query: report.question,
          answer: report.answer,
          queryReport: report,
        },
      ],
      createdAt: new Date().toISOString(),
      datasourceId: report.datasourceId,
      unsaved: false,
    };

    setDrillingDownReport(true);
    await initiateSaveQueryConversation(
      newConversation,
      newConversation.items[0],
    );
    setReportsChosenDataSource(report.reportDataSource);
    setQueriesChosenDataSource(report.reportDataSource);

    setCurrentQueryConversation(newConversation);
    addConversationToHistory(newConversation);
    setCurrentCarouselIndex(0);

    router.push('/queries');
  };

  if (!parsedQueryConversationItem) {
    return null;
  }

  const renderAnswer = () => {
    if (Array.isArray(parsedQueryConversationItem.answer)) {
      return (
        <ul>
          {parsedQueryConversationItem.answer.map(
            (item: any, index: number) => (
              <li key={index}>
                {Object.entries(item).map(([key, value]) => (
                  <span key={key}>
                    {key}: {String(value)}
                  </span>
                ))}
              </li>
            ),
          )}
        </ul>
      );
    } else {
      return <p>{parsedQueryConversationItem.answer}</p>;
    }
  };

  return (
    <NodeViewWrapper className="react-component">
      <div className="content">
        <div
          className="border-2 rounded-md p-4 mb-4"
          style={{ width: 'calc(50% - 1rem)' }}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold">
              {parsedQueryConversationItem.queryReport.reportName}
            </span>
            <ReportDropdown
              report={parsedQueryConversationItem.queryReport}
              onDrillDown={handleDrillDown}
              isLoading={
                isDrillDownLoading ===
                parsedQueryConversationItem.queryReport.id
              }
            />
          </div>
          <div>
            <p className="mb-4">
              <strong>Query:</strong> {parsedQueryConversationItem.query}
            </p>
            <div className="mb-4">
              <strong>Answer:</strong> {renderAnswer()}
            </div>
            {parsedQueryConversationItem.queryReport.chartInfo && (
              <>
                <ReportsChart
                  chartInfo={parsedQueryConversationItem.queryReport.chartInfo}
                />
              </>
            )}
            {parsedQueryConversationItem.queryReport.kpiCardInfo && (
              <KpiCardInfo
                title={
                  parsedQueryConversationItem.queryReport.kpiCardInfo.title
                }
                resultEntity={
                  parsedQueryConversationItem.queryReport.kpiCardInfo
                    .resultEntity
                }
                result={
                  parsedQueryConversationItem.queryReport.kpiCardInfo.result
                }
                resultConnotation={
                  parsedQueryConversationItem.queryReport.kpiCardInfo
                    .resultConnotation
                }
              />
            )}
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};

export default TipTapComponent;
