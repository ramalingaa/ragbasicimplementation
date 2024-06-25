import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from 'zustand/auth/authStore';
import { useRegistryStore } from '../../zustand/registry/registryStore';

const useFetchConnections = () => {
  const { user } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const setConnections = useRegistryStore((state) => state.setConnections);

  useEffect(() => {
    const fetchConnections = async () => {
      if (!user?.sub) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.post('/api/registry/getConnections', {
          userId: user.sub,
        });

        console.log('response.data.connections', response.data.connections);

        if (response.data.connections) {
          setConnections(response.data.connections);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(
            error.response?.data.error ||
            'An error occurred while fetching the connections',
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

    fetchConnections();
  }, [user?.sub, setConnections]);

  return { errorMessage, isLoading };
};

export default useFetchConnections;
