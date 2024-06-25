import axios from 'axios';
import { useState } from 'react';
import { useAuthStore } from 'zustand/auth/authStore';
import { useBlocksStore } from '../../zustand/blocks/blocksStore';
import { useQueriesState } from '../../zustand/queries/queriesStore';

function useGenerateBlock() {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSourceWarning, setDataSourceWarning] = useState<string | null>(
    null,
  );

  const { llmModel } = useQueriesState();
  const { user } = useAuthStore();
  const userId = user?.sub;
  const { blocksChosenDataSource } = useBlocksStore();
  const { addBlockResults } = useBlocksStore();

  const generateBlockCustomerHealthScoring = async (blockId: string) => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    setDataSourceWarning(null);

    if (!url) {
      setError('Backend URL is not defined');
      console.log('Backend URL is not defined');
      setLoading(false);
      return;
    }

    if (!blocksChosenDataSource) {
      console.log('Please choose a data source first');
      setDataSourceWarning('Please choose a data source first');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestData = {
        reportsChosenDataSource: blocksChosenDataSource,
        llmModel: llmModel,
        userId: userId,
      };

      const fullUrl = `${url}/api/v1/generate-block-customer-health-scoring`;
      const response = await axios.post(fullUrl, requestData);

      if (response.status !== 200) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      console.log('response', response);
      const generatedBlock = response.data.data;
      addBlockResults(blockId, response.data.data);
      console.log('generatedBlock', generatedBlock);
    } catch (err) {
      console.error('Axios error:', err);
      let errorMessage =
        'An error occurred while generating the customer health scoring block.';
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

  const generateBlockCustomerChurnScoring = async (blockId: string) => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    setDataSourceWarning(null);

    if (!url) {
      setError('Backend URL is not defined');
      console.log('Backend URL is not defined');
      setLoading(false);
      return;
    }

    if (!blocksChosenDataSource) {
      console.log('Please choose a data source first');
      setDataSourceWarning('Please choose a data source first');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestData = {
        reportsChosenDataSource: blocksChosenDataSource,
        llmModel: llmModel,
        userId: userId,
      };

      const fullUrl = `${url}/api/v1/generate-block-customer-churn-scoring`;
      const response = await axios.post(fullUrl, requestData);

      if (response.status !== 200) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      console.log('response', response);
      const generatedBlock = response.data.data;
      addBlockResults(blockId, response.data.data);
      console.log('generatedBlock', generatedBlock);
    } catch (err) {
      console.error('Axios error:', err);
      let errorMessage =
        'An error occurred while generating the customer churn scoring block.';
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

  const generateBlockAnnualRecurringRevenue = async (blockId: string) => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    setDataSourceWarning(null);

    if (!url) {
      setError('Backend URL is not defined');
      console.log('Backend URL is not defined');
      setLoading(false);
      return;
    }

    if (!blocksChosenDataSource) {
      console.log('Please choose a data source first');
      setDataSourceWarning('Please choose a data source first');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestData = {
        reportsChosenDataSource: blocksChosenDataSource,
        llmModel: llmModel,
        userId: userId,
      };

      const fullUrl = `${url}/api/v1/generate-block-annual-recurring-revenue`;
      const response = await axios.post(fullUrl, requestData);

      if (response.status !== 200) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      console.log('response', response);
      const generatedBlock = response.data.data;
      addBlockResults(blockId, response.data.data);
      console.log('generatedBlock', generatedBlock);
    } catch (err) {
      console.error('Axios error:', err);
      let errorMessage =
        'An error occurred while generating the annual recurring revenue block.';
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

  const generateBlockMonthlyRecurringRevenue = async (blockId: string) => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    setDataSourceWarning(null);

    if (!url) {
      setError('Backend URL is not defined');
      console.log('Backend URL is not defined');
      setLoading(false);
      return;
    }

    if (!blocksChosenDataSource) {
      console.log('Please choose a data source first');
      setDataSourceWarning('Please choose a data source first');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestData = {
        reportsChosenDataSource: blocksChosenDataSource,
        llmModel: llmModel,
        userId: userId,
      };

      const fullUrl = `${url}/api/v1/generate-block-monthly-recurring-revenue`;
      const response = await axios.post(fullUrl, requestData);

      if (response.status !== 200) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }

      console.log('response', response);
      const generatedBlock = response.data.data;
      addBlockResults(blockId, response.data.data);
      console.log('generatedBlock', generatedBlock);
    } catch (err) {
      console.error('Axios error:', err);
      let errorMessage =
        'An error occurred while generating the monthly recurring revenue block.';
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

  const generateBlock = async (blockId: string, blockMetric: string) => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    setDataSourceWarning(null);

    if (!url) {
      setError('Backend URL is not defined');
      console.log('Backend URL is not defined');
      setLoading(false);
      return;
    }

    if (!blocksChosenDataSource) {
      console.log('Please choose a data source first');
      setDataSourceWarning('Please choose a data source first');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestData = {
        reportsChosenDataSource: blocksChosenDataSource,
        llmModel: llmModel,
        userId: userId,
      };

      switch (blockMetric) {
        case 'Customer Health Score':
          await generateBlockCustomerHealthScoring(blockId);
          break;
        case 'Customer Churn Rate':
          await generateBlockCustomerChurnScoring(blockId);
          break;
        case 'Annual Recurring Revenue (ARR)':
          await generateBlockAnnualRecurringRevenue(blockId);
          break;
        case 'Monthly Recurring Revenue (MRR)':
          await generateBlockMonthlyRecurringRevenue(blockId);
          break;
        // Add more cases for other block metrics and their corresponding functions
        default:
          console.log('Unknown block metric:', blockMetric);
          break;
      }
    } catch (err) {
      console.error('Axios error:', err);
      let errorMessage = 'An error occurred while generating the block.';
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
    generateBlock,
  };
}

export default useGenerateBlock;
