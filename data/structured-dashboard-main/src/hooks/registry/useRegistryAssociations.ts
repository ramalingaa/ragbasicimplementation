import { useState } from 'react';
import axios from 'axios';
import { useAuthStore } from 'zustand/auth/authStore';
import { v4 as uuidv4 } from 'uuid';
import { useRegistryStore } from '../../zustand/registry/registryStore';

interface SelectedColumns {
  joining: { first: string | null; second: string | null };
}

const useRegistryAssociations = () => {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const associations = useRegistryStore((state) => state.associations);
  const setAssociations = useRegistryStore((state) => state.setAssociations);

  const [deletingAssociationId, setDeletingAssociationId] = useState<
    string | null
  >(null);

  const saveAssociation = async (association: {
    dataSources: string[];
    selectedColumns: SelectedColumns;
    id: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      await axios.post('/api/registry/saveAssociation', {
        userId: user?.sub,
        association,
      });

      // Update the associations store
      setAssociations([...associations, association]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data.error ||
          'An error occurred while saving the association',
        );
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAssociation = async (associationId: string) => {
    setIsLoading(true);
    setError(null);
    setDeletingAssociationId(associationId);

    try {
      await axios.delete('/api/registry/deleteAssociation', {
        data: {
          userId: user?.sub,
          associationId,
        },
      });

      // Update the associations store by removing the deleted association
      setAssociations(
        associations.filter((assoc) => assoc.id !== associationId),
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data.error ||
          'An error occurred while deleting the association',
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
    saveAssociation,
    deleteAssociation,
    deletingAssociationId,
  };
};

export default useRegistryAssociations;
