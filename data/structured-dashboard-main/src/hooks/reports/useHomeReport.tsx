import axios from 'axios';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useReportsStore } from '../../zustand/reports/reportsStore';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { CompleteReport, Report } from '../../zustand/reports/reportsStore';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';
import { useQueriesState } from '../../zustand/queries/queriesStore';
import { useAuthStore } from 'zustand/auth/authStore';

function useHomeReport() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const {
    homeReport,
    setHomeReport,
    addReportToHomeReport,
    replaceReportInHomeReport,
    setHomeReportSummary,
  } = useReportsStore();

  const { setReportsChosenDataSource } = useHarborStore();

  const { dataSources } = useHarborStore();

  const { currentWorkspace } = useWorkspaceStore();

  const { llmModel } = useQueriesState();

  const { user } = useAuthStore();

  const getOverallReportNameStreamed = async (
    reportTitle: string,
    reportQuestionsFocus: string,
  ) => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!url) {
      console.error('Backend URL is not defined');
      setError('Backend URL is not defined');
      return;
    }

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);
    const formattedDate = currentDate.toISOString().split('T')[0];

    try {
      setLoading(true);
      setError(null);

      const reportsChosenDataSource = dataSources[0];

      const newReport: CompleteReport = {
        overallReportName: 'Overview',
        setReportSummary: '',
        reports: [],
        isReportOpen: false,
        isEditingOverallName: false,
        reportId: uuidv4(),
        reportDataSource: reportsChosenDataSource,
        isGenerating: true,
        dateCreated: formattedDate,
        uploaderEmail: user?.email,
      };
      setHomeReport(newReport);

      let overallReportName = 'Overview';

      // const queryParams = new URLSearchParams({
      //   userId: currentWorkspace.WorkspaceID,
      //   dataSource: JSON.stringify(reportsChosenDataSource),
      // });
      // const fullUrl = `${url}/api/v1/generate-overall-report-name?${queryParams}`;
      // const response = await fetch(fullUrl, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      // if (!response.ok) {
      //   throw new Error('Network response was not ok ' + response.statusText);
      // }
      // if (!response.body) {
      //   throw new Error('No response body');
      // }
      // const reader = response.body.getReader();
      // let text = '';
      // while (true) {
      //   const { done, value } = await reader.read();
      //   if (done) {
      //     break;
      //   }
      //   text += new TextDecoder().decode(value);
      //   setHomeReport({ ...newReport, overallReportName: text });
      // }
      // overallReportName = text;

      getReportSummaryStreamed(overallReportName, reportQuestionsFocus);
    } catch (err) {
      console.error('Axios error:', err);
      let errorMessage = `${err}`;
      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage = `Error generating overall report name: Server responded with status code ${err.response.status}: ${err.response.data.message}`;
        } else if (err.request) {
          errorMessage =
            'Error generating overall report name: No response received from the server. Please try again later.';
        } else {
          errorMessage =
            'Error generating overall report name: Error setting up the request: ' +
            err.message;
        }
      }
      setError(errorMessage);
      setLoading(false);
    }
  };

  const getReportSummaryStreamed = async (
    generatedOverallReportName: string,
    reportQuestionsFocus: string,
  ) => {
    const reportsChosenDataSource = dataSources[0];

    const url = process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!url) {
      console.error('Backend URL is not defined');
      setError('Backend URL is not defined');
      return;
    }

    console.log('______________________');
    console.log('RUNNING getReportSummaryStreamed:', reportsChosenDataSource);
    console.log('______________________');
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        userId: currentWorkspace.WorkspaceID,
        dataSource: JSON.stringify(reportsChosenDataSource),
      });
      const fullUrl = `${url}/api/v1/generate-report-summary?${queryParams}`;
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      let text = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        text += new TextDecoder().decode(value);
        setHomeReportSummary(text);
      }
      getPandaAiReportWithCharts(
        generatedOverallReportName,
        text,
        reportQuestionsFocus,
      );
    } catch (err) {
      console.error('Axios error:', err);
      let errorMessage = `${err}`;
      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage = `Error generating report summary: Server responded with status code ${err.response.status}: ${err.response.data.message}`;
        } else if (err.request) {
          errorMessage =
            'Error generating report summary: No response received from the server. Please try again later.';
        } else {
          errorMessage =
            'Error generating report summary: Error setting up the request: ' +
            err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPandaAiReportWithCharts = async (
    generatedOverallReportName: string,
    generatedOverallSummary: string,
    reportQuestionsFocus: string,
  ) => {
    const reportsChosenDataSource = dataSources[0];

    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    let interval: any;
    if (!url) {
      console.error('Backend URL is not defined');
      setError('Error generating report: Backend URL is not defined');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 98) {
            clearInterval(interval);
            return prev;
          }
          return prev + 0.1;
        });
      }, 400);
      if (
        reportsChosenDataSource &&
        reportsChosenDataSource.hasOwnProperty('decodedContents')
      ) {
        delete reportsChosenDataSource.decodedContents;
      }
      const queryParams = {
        userId: currentWorkspace.WorkspaceID,
        dataSource: JSON.stringify(reportsChosenDataSource),
        reportQuestionsFocus,
        llmModel,
      };
      const fullUrl = `${url}/api/v1/get-panda-ai-report`;
      const response = await axios.get(fullUrl, {
        params: queryParams,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status !== 200) {
        setProgress(100);
        throw new Error(
          `Error generating report: Network response was not ok ${response.statusText}`,
        );
      }
      const fullUrl2 = `${url}/api/v1/get-report-chart-with-pandas-ai-qa`;
      let tempReports: Report[] = [];

      if (typeof response.data === 'string') {
        response.data = JSON.parse(response.data);
      }

      const qaData = response.data.map((qa: any) => ({
        ...qa,
        id: uuidv4(),
      }));

      for (const qa of qaData) {
        useReportsStore
          .getState()
          .addReportToHomeReportWithQuestion(qa.id, qa.question);
      }

      for (const qa of qaData) {
        const queryParams = {
          userId: currentWorkspace.WorkspaceID,
          qaPair: JSON.stringify(qa),
          llmModel,
        };
        try {
          const response = await axios.get(fullUrl2, {
            params: queryParams,
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.status !== 200) {
            throw new Error(
              `Error generating report: Network response was not ok: ${response.statusText}`,
            );
          }
          const generatedReportString = response.data.report;
          const generatedReport = JSON.parse(generatedReportString);

          tempReports.push(generatedReport);

          // addReportToHomeReport(generatedReport);
          replaceReportInHomeReport(qa.id, generatedReport);
        } catch (error) {
          console.error('Error fetching report data:', error);
          setError(`Error generating report: ${error}`);
        }
      }
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1);
      const formattedDate = currentDate.toISOString().split('T')[0];

      const completeReport: CompleteReport = {
        overallReportName: generatedOverallReportName,
        setReportSummary: generatedOverallSummary,
        reports: tempReports,
        isReportOpen: false,
        isEditingOverallName: false,
        reportId: homeReport?.reportId || '',
        reportDataSource: reportsChosenDataSource,
        dateCreated: formattedDate,
        uploaderEmail: user?.email,
      };
      setHomeReport(completeReport);
    } catch (err) {
      console.error('Axios error:', err);
      let errorMessage = `${err}`;
      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage = `Error generating report: Server responded with status code ${err.response.status}: ${err.response.data.message}`;
        } else if (err.request) {
          errorMessage =
            'Error generating report: No response received from the server. Please try again later.';
        } else {
          errorMessage =
            'Error generating report: Error setting up the request: ' +
            err.message;
        }
      }
      setError(errorMessage);
      setLoading(false);
    } finally {
      clearInterval(interval);
      setProgress(0);
      setLoading(false);
    }
  };
  return {
    isLoading,
    error,
    progress,
    getOverallReportNameStreamed,
    getReportSummaryStreamed,
    getPandaAiReportWithCharts,
  };
}
export default useHomeReport;
