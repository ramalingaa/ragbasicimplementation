import { useState } from 'react';
import { useAuthStore } from 'zustand/auth/authStore';

const useUpdateLLMModel = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateLLMModel = async (llmModel: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/settings/update-llm-model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.sub,
          llmModel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update LLM model');
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  };

  return {
    updateLLMModel,
    isLoading,
    error,
  };
};

export default useUpdateLLMModel;
