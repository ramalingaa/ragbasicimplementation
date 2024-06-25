import axios from 'axios';
import { useState } from 'react';

import { useAuthStore } from 'zustand/auth/authStore';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useReportsStore } from '../../zustand/reports/reportsStore';

import { v4 as uuidv4 } from 'uuid';
import useQueriesConversation from './useQueriesConversation';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';

import {
  QueryConversationItem,
  useQueriesState,
  QueryConversation,
} from '../../zustand/queries/queriesStore';
import { NEW_THREAD_CONVERSATION_NAME } from 'utils/constants';

function useQueriesMagicFlow() {
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

  const getQueriesResultsChart = async (
    queriesResultsData: {
      query: string;
      answer: any;
      report: string;
      itemId: string;
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
            { ...newItem, queryReport: generatedReport },
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

  const getQueriesMagicFlowQuery = async () => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    setDataSourceWarning(null);

    if (!url) {
      setError('Backend URL is not defined');
      console.log('Backend URL is not defined');
      setLoading(false);

      return;
    }

    if (!reportsChosenDataSource) {
      console.log('Please choose a data source first');
      setDataSourceWarning('Please choose a data source first');
      setLoading(false);
      return;
    }

    if (!currentWorkspace) {
      console.log('Please select a workspace first');
      setLoading(false);
      return;
    }

    if (!llmModel) {
      console.log('Please select a LLM model first');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestData = {
        reportsChosenDataSource: reportsChosenDataSource,
        llmModel: llmModel,
        userId: userId,
      };

      const fullUrl = `${url}/api/v1/queries-magic-flow-query`;
      const response = await fetch(fullUrl, {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      const reader = response.body.getReader();
      let generatedQuery = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = new TextDecoder().decode(value);
        generatedQuery += chunk;
        setQueriesTextAreaText(generatedQuery);
      }

      console.log('generatedQuery', generatedQuery);

      var newItem: QueryConversationItem = {
        id: uuidv4(),
        query: generatedQuery,
        answer: 'Generating...',
        queryReport: null,
        isGenerating: true,
        bookmarked: false,
      };

      if (currentQueryConversation) {
        let currentQueryConvoName = currentQueryConversation?.conversationName;
        const updatedConversation: QueryConversation = {
          ...currentQueryConversation,
          conversationName:
            currentQueryConversation?.conversationName !==
            NEW_THREAD_CONVERSATION_NAME
              ? currentQueryConversation?.conversationName
              : generatedQuery,
          items: [
            ...currentQueryConversation.items.filter(
              (item) => item.isGenerating !== true,
            ),
            newItem,
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

        if (currentQueryConvoName == NEW_THREAD_CONVERSATION_NAME) {
          setCurrentCarouselIndex(0);
        } else {
          setCurrentCarouselIndex(currentCarouselIndex + 1);
        }
      } else {
        const newConversation: QueryConversation = {
          id: uuidv4(),
          conversationName: generatedQuery,
          items: [newItem],
          datasourceId: reportsChosenDataSource.id,
          createdAt: new Date().toISOString(),
        };

        setCurrentQueryConversation(newConversation);
        initiateSaveQueryConversation(newConversation, newItem);
      }

      const pandasAiRequestData = {
        query: generatedQuery,
        logSource: reportsChosenDataSource,
        llmModel: llmModel,
      };

      const pandasAiFullUrl = `${url}/api/v1/queries-report-pandas-ai-results`;
      const pandasAiResponse = await axios.post(
        pandasAiFullUrl,
        pandasAiRequestData,
      );

      if (pandasAiResponse.status !== 200) {
        throw new Error(
          `Network response was not ok: ${pandasAiResponse.status}`,
        );
      }

      console.log('pandasAiResponse', pandasAiResponse);
      const answer = pandasAiResponse.data.answer;

      var newItem: QueryConversationItem = {
        id: uuidv4(),
        query: generatedQuery,
        answer: answer,
        queryReport: null,
        bookmarked: false,
      };

      await getQueriesResultsChart(
        {
          query: generatedQuery,
          answer: answer,
          report: '',
          itemId: newItem.id,
        },
        newItem,
      );
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
      setLoading(false);
    }
  };

  return {
    isLoading,
    error,
    dataSourceWarning,
    getQueriesResultsChart,
    getQueriesMagicFlowQuery,
  };
}

export default useQueriesMagicFlow;
