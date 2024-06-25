'use client';

import HistoryContainer from 'components/queries/HistoryContainer';
import Queries from 'components/queries/Queries';
import Wrapper from 'components/queriesPage/wrapper/Wrapper';
import { useQueriesState } from '../../../zustand/queries/queriesStore';
import { useEffect } from 'react';
import { useWorkspaceStore } from 'zustand/workspaces/workspaceStore';
import useQueries from 'hooks/queries/useQueries';
import { useNotificationStore } from 'zustand/notification/notificationStore';
import { useSearchParams } from 'next/navigation';
import { useHarborStore } from 'zustand/harbor/harborStore';
import useFetchDataSources from 'hooks/harbor/useFetchDataSources';
import { DataSource } from 'interfaces/DataTypes';

export default function QueriesPage() {
  const { threadsViewMode, setThreadsViewMode, queryConversationHistory } = useQueriesState(); // threadsViewMode is either 'view' or 'collapse'
  useEffect(() => {
    if (queryConversationHistory?.conversations.length === 0) {
      setThreadsViewMode('collapse');
    }
  }, [queryConversationHistory?.conversations]);

  const { currentWorkspace } = useWorkspaceStore();
  const { availableWorkspaces, setCurrentWorkspace } = useWorkspaceStore();
  const { setNotificationState } = useNotificationStore();
  const { setCurrentQueryConversation } = useQueriesState();
  const searchParams = useSearchParams()
  const { fetchDataSources } = useFetchDataSources();
  const {
    setQueriesChosenDataSource,
    setReportsChosenDataSource,
    dataSources,
  } = useHarborStore();

  useEffect(() => {
    if (currentWorkspace && queryConversationHistory?.conversations.length) {
      const conversationId = searchParams.get('threadId');
      const workspaceId = searchParams.get('workspaceId');

      if (workspaceId && availableWorkspaces.length > 0 && dataSources.length > 0) {
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

      if (conversationId) {
        const conversation = queryConversationHistory?.conversations.find(
          (convo) => convo.id === conversationId,
        );

        if (conversation) {
          setCurrentQueryConversation(conversation);
          setQueriesChosenDataSource(
            dataSources.find(
              (dataSource: DataSource) => dataSource.id === conversation.datasourceId,
            ),
          );
          setReportsChosenDataSource(
            dataSources.find(
              (dataSource: DataSource) => dataSource.id === conversation.datasourceId,
            ),
          );

          const newUrl = window.location.href.replace(`threadId=${conversationId}`, '');
          window.history.replaceState({}, '', newUrl);
        } else {
          setNotificationState(true, 'Thread not found', 'failure')
        }
      }

      // if url ends with ?& remove the last ? from the url
      if (window.location.href.endsWith('?&')) {
        const newUrl = window.location.href.replace('?&', '');
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [currentWorkspace, queryConversationHistory, dataSources]);

  return (
    <>
      <Wrapper>
        <div className={`transition-all overflow-y-scroll duration-500 ease-in-out ${threadsViewMode === 'collapse' ? 'w-full' : 'w-[70%]'
          }`}>
          <Queries />
        </div>
        <div className={`transition-all overflow-y-scroll duration-500 ease-in-out ${threadsViewMode === 'collapse' ? 'hidden' : 'w-[30%]'
          } border-[1px] border-[#eeeff1] rounded-md`}>
          <HistoryContainer />
        </div>
      </Wrapper>
    </>
  );
}
