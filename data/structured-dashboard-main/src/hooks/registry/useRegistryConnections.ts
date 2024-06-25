import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from 'zustand/auth/authStore';
import { v4 as uuidv4 } from 'uuid';
import { useRegistryStore } from '../../zustand/registry/registryStore';

interface SelectedColumns {
  joining: { first: string | null; second: string | null };
  syncing: { first: string | null; second: string | null };
}

const useRegistryConnections = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [deletingConnectionId, setDeletingConnectionId] = useState<
    string | null
  >(null);

  const connections = useRegistryStore((state) => state.connections);
  const setConnections = useRegistryStore((state) => state.setConnections);

  const saveConnection = async (connection: {
    dataSources: string[];
    selectedColumns: SelectedColumns;
    id: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.post('/api/registry/saveConnection', {
        userId: user?.sub,
        connection,
      });

      //update the connections store
      setConnections([...connections, connection]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data.error ||
          'An error occurred while saving the connection',
        );
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConnection = async (connectionId: string) => {
    setIsLoading(true);
    setError(null);
    setDeletingConnectionId(connectionId);

    try {
      await axios.delete('/api/registry/deleteConnection', {
        data: {
          userId: user?.sub,
          connectionId,
        },
      });

      // Update the connections store by removing the deleted connection
      setConnections(
        connections.filter((connection) => connection.id !== connectionId),
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data.error ||
          'An error occurred while deleting the connection',
        );
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    saveConnection,
    deleteConnection,
    deletingConnectionId,
  };
};

export default useRegistryConnections;
