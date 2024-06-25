import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from 'zustand/auth/authStore';
import { useRegistryStore } from '../../zustand/registry/registryStore';

const useFetchAssociations = () => {
  const { user } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const setAssociations = useRegistryStore((state) => state.setAssociations);

  useEffect(() => {
    const fetchAssociations = async () => {
      if (!user?.sub) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.post('/api/registry/getAssociations', {
          userId: user.sub,
        });

        if (response.data.associations) {
          setAssociations(response.data.associations);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(
            error.response?.data.error ||
            'An error occurred while fetching the associations',
          );
        } else if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('An unknown error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssociations();
  }, [user?.sub, setAssociations]);

  return { errorMessage, isLoading };
};

export default useFetchAssociations;
