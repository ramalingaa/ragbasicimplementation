import axios from 'axios';
import { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { useReportsStore } from '../../zustand/reports/reportsStore';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { CompleteReport, Report } from '../../zustand/reports/reportsStore';
import { set } from '@auth0/nextjs-auth0/dist/session';
import { useWorkspaceStore } from '../../zustand/workspaces/workspaceStore';
import { useQueriesState } from '../../zustand/queries/queriesStore';
import { useAuthStore } from 'zustand/auth/authStore';
import { useNotificationStore } from 'zustand/notification/notificationStore';

interface ErrorType {
  name: string;
  message: string;
  stack?: string;
}

function useReports() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const [dataSourceWarning, setDataSourceWarning] = useState<string | null>(
    null,
  );

  const {
    reportResponse,
    setReportResponse,
    setReportSummary,
    setGeneratedReports,
    overallReportName,
    reportSummary,
    setGeneratedReportsArr,
    generatedReports,
    toggleReportReloading,
    toggleReportGenerating,
    replaceCompleteReport,
    addReportToCompleteReport,
    setOverallReportNameForSpecificReport,
    setReportSummaryForSpecificReport,
    addReportToCompleteReportWithUUID,
    replaceReportInCompleteReport,
    setCompleteReportErrorMessage,
    reportsChosenTemplate,
    selectedReportId,
    setSelectedReportId,
    setIsCompleteReportModalOpen,
  } = useReportsStore();

  const { llmModel } = useQueriesState();

  const { setReportsChosenDataSource, reportsChosenDataSource } =
    useHarborStore((state) => ({
      setReportsChosenDataSource: state.setReportsChosenDataSource,
      reportsChosenDataSource: state.reportsChosenDataSource,
    }));

  const { currentWorkspace } = useWorkspaceStore();

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
    currentDate.setDate(currentDate.getDate() + 1); // Add one day to the current date
    const formattedDate = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    if (!reportsChosenDataSource) {
      const newReportId = uuidv4();

      const newReport: CompleteReport = {
        overallReportName: reportTitle === '' ? 'Untitled Report' : reportTitle,
        setReportSummary: reportQuestionsFocus,
        reports: [],
        isReportOpen: false,
        isEditingOverallName: false,
        reportId: newReportId,
        reportDataSource: reportsChosenDataSource,
        isGenerating: false,
        dateCreated: formattedDate,
        uploaderEmail: user?.email,
      };

      console.log('????? here ?????');
      console.log('newReport', newReport);
      console.log('????? here ?????');

      setGeneratedReportsArr([newReport, ...generatedReports]);
      saveCompleteReport(newReport);
      setLoading(false);

      return;
    }
    const newReportId = uuidv4();
    try {
      setLoading(true);
      setError(null);

      const newReport: CompleteReport = {
        overallReportName: reportTitle === '' ? 'Untitled Report' : reportTitle,
        setReportSummary: '',
        reports: [],
        isReportOpen: false,
        isEditingOverallName: false,
        reportId: newReportId,
        reportDataSource: reportsChosenDataSource,
        isGenerating: true,
        dateCreated: formattedDate,
        uploaderEmail: user?.email,
      };
      setGeneratedReportsArr([newReport, ...generatedReports]);
      saveCompleteReport(newReport);

      //open report creation modal
      setSelectedReportId(newReportId);
      setIsCompleteReportModalOpen(true);

      let overallReportName = '';

      if (reportTitle === '') {
        const queryParams = new URLSearchParams({
          userId: currentWorkspace.WorkspaceID,
          dataSource: JSON.stringify(reportsChosenDataSource),
        });
        const fullUrl = `${url}/api/v1/generate-overall-report-name?${queryParams}`;
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
          setOverallReportNameForSpecificReport(newReportId, text);
        }
        overallReportName = text;
      } else {
        overallReportName = reportTitle;
        setOverallReportNameForSpecificReport(newReportId, overallReportName);
      }
      getReportSummaryStreamed(
        newReportId,
        overallReportName,
        reportQuestionsFocus,
      );
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
      setCompleteReportErrorMessage(newReportId, errorMessage);
      setLoading(false);
    }
  };

  const getReportSummaryStreamed = async (
    newReportId: string,
    generatedOverallReportName: string,
    reportQuestionsFocus: string,
  ) => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!url) {
      console.error('Backend URL is not defined');
      setError('Backend URL is not defined');
      return;
    }
    if (!reportsChosenDataSource) {
      setDataSourceWarning('Please choose a data source first');
      return;
    }
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
        setReportSummaryForSpecificReport(newReportId, text);
      }
      if (reportsChosenTemplate) {
        getPandaAiTemplateReportWithCharts(
          generatedOverallReportName,
          text,
          newReportId,
          reportsChosenTemplate.name,
        );
      } else {
        getPandaAiReportWithCharts(
          generatedOverallReportName,
          text,
          newReportId,
          reportQuestionsFocus,
        );
      }
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
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPandaAiTemplateReportWithCharts = async (
    generatedOverallReportName: string,
    generatedOverallSummary: string,
    newReportId: string,
    template: string,
  ) => {
    console.log('calling getPandaAiTemplateReportWithCharts');
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
      setReportResponse([]);
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
        template,
        llmModel,
      };
      const fullUrl = `${url}/api/v1/get-panda-ai-template-report`;
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

          useReportsStore
            .getState()
            .addReportToCompleteReport(newReportId, generatedReport);
        } catch (error) {
          console.error('Error fetching report data:', error);

          setCompleteReportErrorMessage(
            newReportId,
            `Error generating report: ${error}`,
          );
          setError(`Error generating report: ${error}`);
        }
      }
      const completeReport: CompleteReport = {
        overallReportName: generatedOverallReportName,
        setReportSummary: generatedOverallSummary,
        reports: tempReports,
        isReportOpen: false,
        isEditingOverallName: false,
        reportId: newReportId,
        reportDataSource: reportsChosenDataSource,
        uploaderEmail: user?.email,
      };

      saveCompleteReport(completeReport);
      toggleReportGenerating(completeReport.reportId);
    } catch (err) {
      console.error('Axios error:', err);
      let errorMessage = `${err}`;
      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage = `Error generating report: Server responded with status code ${err.response.status}: ${err.response.data.message}`;
          setCompleteReportErrorMessage(newReportId, errorMessage);
        } else if (err.request) {
          errorMessage =
            'Error generating report: No response received from the server. Please try again later.';
          setCompleteReportErrorMessage(newReportId, errorMessage);
        } else {
          errorMessage =
            'Error generating report: Error setting up the request: ' +
            err.message;
          setCompleteReportErrorMessage(newReportId, errorMessage);
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

  const getPandaAiReportWithCharts = async (
    generatedOverallReportName: string,
    generatedOverallSummary: string,
    newReportId: string,
    reportQuestionsFocus: string,
  ) => {
    console.log('calling getPandaAiReportWithCharts');
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
      setReportResponse([]);
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

      //check if response.data is a string, if so parse it
      if (typeof response.data === 'string') {
        response.data = JSON.parse(response.data);
      }

      const qaData = response.data.map((qa: any) => ({
        ...qa,
        id: uuidv4(),
      }));
      console.log('qaData', qaData);

      // Add reports with only id and question
      for (const qa of qaData) {
        useReportsStore
          .getState()
          .addReportToCompleteReportWithUUID(
            newReportId,
            qa.id,
            qa.question,
            '',
          );
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
          console.log('______________________');
          console.log(' response.data', response.data);
          console.log('______________________');

          const generatedReport = JSON.parse(generatedReportString);

          //Update tempReports with the generated report
          tempReports.push(generatedReport);

          // Replace the report instead of adding it again
          useReportsStore
            .getState()
            .replaceReportInCompleteReport(newReportId, qa.id, generatedReport);
          console.log('!!!!! ________________ !!!!!');
          console.log('Report replaced in complete report');
          console.log('!!!!! ________________ !!!!!');
        } catch (error) {
          console.error('Error fetching report data:', error);

          useReportsStore
            .getState()
            .setCompleteReportErrorMessage(
              newReportId,
              `Error generating report: ${error}`,
            );
          setError(`Error generating report: ${error}`);
        }
      }
      console.log('overallReportName', overallReportName);
      console.log('reportSummary', reportSummary);
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1); // Add one day to the current date
      const formattedDate = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

      const completeReport: CompleteReport = {
        overallReportName: generatedOverallReportName,
        setReportSummary: generatedOverallSummary,
        reports: tempReports,
        isReportOpen: false,
        isEditingOverallName: false,
        reportId: newReportId,
        reportDataSource: reportsChosenDataSource,
        dateCreated: formattedDate,
        uploaderEmail: user?.email,
      };
      saveCompleteReport(completeReport);
      toggleReportGenerating(completeReport.reportId);
    } catch (err) {
      console.error('Axios error:', err);
      let errorMessage = `${err}`;
      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage = `Error generating report: Server responded with status code ${err.response.status}: ${err.response.data.message}`;
          useReportsStore
            .getState()
            .setCompleteReportErrorMessage(newReportId, errorMessage);
        } else if (err.request) {
          errorMessage =
            'Error generating report: No response received from the server. Please try again later.';
          useReportsStore
            .getState()
            .setCompleteReportErrorMessage(newReportId, errorMessage);
        } else {
          errorMessage =
            'Error generating report: Error setting up the request: ' +
            err.message;
          useReportsStore
            .getState()
            .setCompleteReportErrorMessage(newReportId, errorMessage);
        }
      }
      setError(errorMessage);
      setError(errorMessage);
      setLoading(false);
    } finally {
      clearInterval(interval);
      setProgress(0);
      setLoading(false);
    }
  };

  const { user } = useAuthStore();

  const saveCompleteReport = async (completeReport: any) => {
    try {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + 1); // Add one day to the current date
      const formattedDate = currentDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD

      completeReport = {
        ...completeReport,
        dateCreated: formattedDate,
        isGenerating: false,
        saved: true,
        uploaderEmail: user?.email,
      };

      console.log('complete report being saved...... ...... .. . .. .. . .');
      console.log('completeReport', completeReport);
      console.log('complete report being saved...... ...... .. . .. .. . .');

      const response = await axios.post('/api/reports/saveReport', {
        WorkspaceID: currentWorkspace.WorkspaceID,
        completeReport,
      });

      console.log('report saved successfully', response);
    } catch (error) {
      console.log('Error saving report:', error);
    }
  };

  const updateCompleteReport = async (completeReport: any) => {
    try {
      const response = await axios.put('/api/reports/saveReport', {
        WorkspaceID: currentWorkspace.WorkspaceID,
        completeReport,
      });

      console.log('report updated successfully', response);
    } catch (error) {
      console.log('Error updating report:', error);
    }
  };

  const deleteReport = async (reportId: string) => {
    try {
      setGeneratedReportsArr(
        generatedReports.filter((report) => report.reportId !== reportId),
      );

      const response = await axios.post('/api/reports/deleteReport', {
        reportId,
        WorkspaceID: currentWorkspace.WorkspaceID,
      });

      console.log('Report deleted successfully', response);
    } catch (error) {
      console.log('Error deleting report:', error);
    }
  };

  const deleteAllReports = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/reports/deleteAllReports', {
        WorkspaceID: currentWorkspace.WorkspaceID,
      });
      setGeneratedReportsArr([]);
      console.log('All reports deleted successfully', response);
    } catch (error) {
      console.log('Error deleting all reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const { setNotificationState } = useNotificationStore();
  const copyReportLinkToClipboard = async (reportId: string) => {
    try {
      const url = `${window.location.origin}/reports?reportId=${reportId}&workspaceId=${currentWorkspace?.WorkspaceID}`;
      await navigator.clipboard.writeText(url);
      setNotificationState(
        true, 'Report link copied to clipboard', 'success'
      );
    } catch (err) {
      setNotificationState(
        true, 'Report link copy to clipboard failed', 'failure'
      );
      console.error('Error copying to clipboard:', err);
    }
  }

  return {
    result,
    isLoading,
    error,
    progress,
    getReportSummaryStreamed,
    getOverallReportNameStreamed,
    deleteReport,
    updateCompleteReport,
    deleteAllReports,
    dataSourceWarning,
    copyReportLinkToClipboard
  };
}

export default useReports;
