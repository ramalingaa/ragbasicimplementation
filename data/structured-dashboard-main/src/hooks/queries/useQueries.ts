import axios from 'axios';
import { useState } from 'react';

import { useAuthStore } from 'zustand/auth/authStore';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useReportsStore } from '../../zustand/reports/reportsStore';

import { v4 as uuidv4, v4 } from 'uuid';
import useQueriesConversation from './useQueriesConversation';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';

import {
  QueryConversationItem,
  useQueriesState,
  QueryConversation,
} from '../../zustand/queries/queriesStore';
import { NEW_THREAD_CONVERSATION_NAME } from 'utils/constants';
import { useNotificationStore } from 'zustand/notification/notificationStore';
import { convertStringToAlphanumericAndUnderscoresString } from 'utils/formatters';

function useQueries() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSourceWarning, setDataSourceWarning] = useState<string | null>(
    null,
  );

  const { user } = useAuthStore();
  const userId = user?.sub;

  const { reportsChosenDataSource } = useHarborStore();
  const { setQueryReport, setLastQueryReport, lastQueryReport } =
    useReportsStore();
  const { currentWorkspace } = useWorkspaceStore();

  const {
    currentQueryConversation,
    setCurrentQueryConversation,
    setQueryConversationHistory,
    queryConversationHistory,
    addConversationToHistory,
    currentCarouselIndex,
    setCurrentCarouselIndex,
    llmModel,
    updateConversationInHistory,
    queriesTextAreaText,
    setQueriesTextAreaText,
  } = useQueriesState();

  const { initiateSaveQueryConversation } = useQueriesConversation();

  const getQueriesReportResult = async (query: string) => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;

    setDataSourceWarning(null);

    if (!url) {
      setError('Backend URL is not defined');
      console.log('Backend URL is not defined');
      return;
    }

    if (!reportsChosenDataSource) {
      console.log('Please choose a data source first');
      setDataSourceWarning('Please choose a data source first');
      return;
    }

    if (!currentWorkspace) {
      console.log('Please select a workspace first');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestData = {
        userId: currentWorkspace?.WorkspaceID,
        query: query,
        logSource: reportsChosenDataSource,
        selectedDrillDownReport: lastQueryReport,
      };

      const fullUrl = `${url}/api/v1/queries-report`;

      const response = await axios.post(fullUrl, requestData);

      if (response.status !== 200) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const report = response.data.report;
      const answer = response.data.report.answer;

      if (currentQueryConversation) {
        const newItem: QueryConversationItem = {
          id: uuidv4(),
          query: query,
          answer: answer,
          queryReport: report,
        };

        const updatedConversation: QueryConversation = {
          ...currentQueryConversation,
          items: [...currentQueryConversation.items, newItem],
        };

        setCurrentQueryConversation(updatedConversation);
        setLastQueryReport(report);
        setQueryReport(report);
        initiateSaveQueryConversation(updatedConversation, newItem);
        setCurrentCarouselIndex(currentCarouselIndex + 1);
      } else {
        const newItem = {
          id: uuidv4(),
          query: query,
          answer: answer,
          queryReport: report,
          bookmarked: false,
        };

        const newConversation: QueryConversation = {
          id: uuidv4(),
          conversationName: query,
          items: [newItem],
        };

        setCurrentQueryConversation(newConversation);
        setLastQueryReport(report);
        setQueryReport(report);
        initiateSaveQueryConversation(newConversation, newItem);
      }
    } catch (err) {
      console.error('Axios error:', err);
      let errorMessage = 'An error occurred while running the query.';

      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage = `Server responded with status code ${err.response.status}: ${err.response.data.message}`;
        } else if (err.request) {
          errorMessage =
            'No response received from the server. Please try again later.';
        } else {
          errorMessage = 'Error setting up the request: ' + err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setQueriesTextAreaText('');
      setLoading(false);
    }
  };

  const getQueriesReportPandasAiResults = async (query: string) => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    setDataSourceWarning(null);

    if (!url) {
      setError('Backend URL is not defined');
      console.log('Backend URL is not defined');
      return;
    }

    if (!reportsChosenDataSource) {
      console.log('Please choose a data source first');
      setDataSourceWarning('Please choose a data source first');
      return;
    }

    if (!currentWorkspace) {
      console.log('Please select a workspace first');
      return;
    }

    if (!llmModel) {
      console.log('Please select a LLM model first');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestDataV1 = {
        query: query,
        logSource: reportsChosenDataSource,
        llmModel: llmModel,
      };

      const requestDataV2 = {
        query: query,
        workpaceId: convertStringToAlphanumericAndUnderscoresString(currentWorkspace?.WorkspaceID),
        tableName: convertStringToAlphanumericAndUnderscoresString(reportsChosenDataSource.fileMetadata.fullFileKey.replace('structured-harbor-uploads-v0/', '')),
      };

      const requestDataV3 = {
        query: query,
        datasetId: convertStringToAlphanumericAndUnderscoresString(currentWorkspace?.WorkspaceID),
      };


      const requestFallbacks = [
        {
          url: `${url}/api/v1/queries-report-pandas-ai-results-v2`,
          data: requestDataV2
        },
        {
          url: `${url}/api/v3/queries-report-pandas-ai-results`,
          data: requestDataV3
        },
        {
          url: `${url}/api/v1/queries-report-pandas-ai-results`,
          data: requestDataV1
        },
      ]

      for (let i = 0; i < requestFallbacks.length; i++) {
        try {
          const request = requestFallbacks[i];
          const response = await axios.post(request.url, request.data);

          if (response.status !== 200) {
            throw new Error(`Network response was not ok: ${response.status}`);
          }

          console.log("request.url", request.url,'response', response);
          const answer = response.data.answer;

          if (!answer) {
            continue;
          }

          const newItem: QueryConversationItem = {
            id: uuidv4(),
            query: query,
            answer: answer,
            codeGenerated: response.data?.code_generated,
            queryReport: null,
            bookmarked: false,
          };

          await getQueriesResultsChart(
            { ...response.data, itemId: newItem.id },
            newItem,
          );
          return;
        } catch (err) {
          continue;
        }
      }

      // console.log('requestData', requestData);
      // const fullUrl = `${url}/api/v1/queries-report-pandas-ai-results`;
      const fullUrl = `${url}/api/v1/queries-report-pandas-ai-results-v2`;
      // const response = await axios.post(fullUrl, requestData);

      // if (response.status !== 200) {
      //   throw new Error(`Network response was not ok: ${response.status}`);
      // }

      // console.log('response', response);
      // const answer = response.data.answer;

      // const newItem: QueryConversationItem = {
      //   id: uuidv4(),
      //   query: query,
      //   answer: answer,
      //   queryReport: null,
      //   bookmarked: false,
      // };

      // await getQueriesResultsChart(
      //   { ...response.data, itemId: newItem.id },
      //   newItem,
      // );
    } catch (err) {
      console.error('Axios error:', err);
      let errorMessage = 'An error occurred while running the query.';
      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage = `Server responded with status code ${err.response.status}: ${err.response.data.message}`;
        } else if (err.request) {
          errorMessage =
            'No response received from the server. Please try again later.';
        } else {
          errorMessage = 'Error setting up the request: ' + err.message;
        }
      }
      setError(errorMessage);
    } finally {
    }
  };

  const getQueriesResultsChart = async (
    queriesResultsData: {
      query: string;
      answer: any;
      report: string;
      itemId: string;
      code_generated?: string;
    },
    newItem: QueryConversationItem,
  ) => {
    const { query, answer, itemId } = queriesResultsData;
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!url) {
      setError('Backend URL is not defined');
      console.log('Backend URL is not defined');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestData = {
        query: query,
        answer: answer,
        llmModel: llmModel,
      };

      console.log('requestData', requestData);

      const fullUrl = `${url}/api/v1/queries-results-chart`;
      const response = await axios.post(fullUrl, requestData);

      if (response.status !== 200) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      console.log('response', response);
      const generatedReportString = response.data.report;

      // Parse the report string into an object
      const generatedReport = JSON.parse(generatedReportString);

      if (currentQueryConversation) {
        let currentQueryConvoName = currentQueryConversation?.conversationName;
        const updatedConversation: QueryConversation = {
          ...currentQueryConversation,
          conversationName:
            currentQueryConversation?.conversationName !==
              NEW_THREAD_CONVERSATION_NAME
              ? currentQueryConversation?.conversationName
              : query,
          items: [
            ...currentQueryConversation.items.filter(
              (item) => item.isGenerating !== true,
            ),
            { ...newItem, queryReport: generatedReport, codeGenerated: queriesResultsData?.code_generated },
          ],
          datasourceId: reportsChosenDataSource.id,
          createdAt: new Date().toISOString(),
          unsaved: currentQueryConversation?.unsaved ? false : true,
          id: currentQueryConversation?.id,
        };
        console.log('currentQueryConversation', currentQueryConversation);
        console.log('updatedConversation', updatedConversation);
        setCurrentQueryConversation(updatedConversation);
        updateConversationInHistory(updatedConversation);
        setLastQueryReport(null);
        setQueryReport(generatedReport);
        initiateSaveQueryConversation(updatedConversation, newItem);
        if (currentQueryConvoName == NEW_THREAD_CONVERSATION_NAME) {
          setCurrentCarouselIndex(0);
        } else {
          setCurrentCarouselIndex(currentCarouselIndex + 1);
        }
      } else {
        const newConversation: QueryConversation = {
          id: uuidv4(),
          conversationName: query,
          items: [{ ...newItem, queryReport: generatedReport }],
          datasourceId: reportsChosenDataSource.id,
          createdAt: new Date().toISOString(),
        };
        setCurrentQueryConversation(newConversation);
        setLastQueryReport(null);
        setQueryReport(generatedReport);
        initiateSaveQueryConversation(newConversation, newItem);
      }
    } catch (err) {
      console.error('Axios error:', err);
      let errorMessage = 'An error occurred while fetching the chart data.';
      setCurrentQueryConversation(
        currentQueryConversation
          ? {
            ...currentQueryConversation,
            items: currentQueryConversation.items.filter(
              (item) => item.isGenerating !== true,
            ),
          }
          : null,
      );
      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage = `Server responded with status code ${err.response.status}: ${err.response.data.message}`;
        } else if (err.request) {
          errorMessage =
            'No response received from the server. Please try again later.';
        } else {
          errorMessage = 'Error setting up the request: ' + err.message;
        }
      }

      setError(errorMessage);
    } finally {
      setQueriesTextAreaText('');
      setLoading(false);
    }
  };

  const { setNotificationState } = useNotificationStore();
  const copyThreadLinkToClipboard = async (conversationId: string) => {
    try {
      const url = `${window.location.origin}/queries?threadId=${conversationId}&workspaceId=${currentWorkspace?.WorkspaceID}`;
      await navigator.clipboard.writeText(url);
      setNotificationState(
        true, 'Thread link copied to clipboard', 'success'
      );
    } catch (err) {
      setNotificationState(
        true, 'Thread link copy to clipboard failed', 'failure'
      );
      console.error('Error copying to clipboard:', err);
    }
  }

  const { availableWorkspaces, setCurrentWorkspace } = useWorkspaceStore();
  const useUrlParamsHandler = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const conversationId = urlParams.get('threadId');
    const workspaceId = urlParams.get('workspaceId');

    if (workspaceId && availableWorkspaces.length > 0) {
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

  return {
    isLoading,
    error,
    dataSourceWarning,
    getQueriesReportPandasAiResults,
    getQueriesResultsChart,
    copyThreadLinkToClipboard,
    useUrlParamsHandler
  };
}

export default useQueries;
