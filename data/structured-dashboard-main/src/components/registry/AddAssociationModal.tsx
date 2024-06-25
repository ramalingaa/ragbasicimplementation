import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Select, Table,
  TableCaption,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react';
import useFetchDataSources from 'hooks/harbor/useFetchDataSources';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { v4 as uuidv4 } from 'uuid';
import useRegistryAssociations from 'hooks/registry/useRegistryAssociations';
import {ModalWrapper} from 'components/modal/ModalWrapper';
import ModalButtons from 'components/modal/ModalButtons';

interface AddAssociationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAssociationModal: React.FC<AddAssociationModalProps> = ({
  isOpen,
  onClose,
}) => {

  const [selectedDataSources, setSelectedDataSources] = useState<{
    source: string | null;
    destination: string | null;
  }>({ source: null, destination: null });

  const { errorMessage, isLoading, getFileContents } = useFetchDataSources();

  const dataSources = useHarborStore((state) => state.dataSources);

  useEffect(() => {
    const fetchContents = async () => {
      if (selectedDataSources.source) {
        const dataSource = dataSources.find(
          (ds) => ds.id === selectedDataSources.source,
        );
        if (dataSource && !dataSource.decodedContents)
          await getFileContents(dataSource);
      }
      if (selectedDataSources.destination) {
        const dataSource = dataSources.find(
          (ds) => ds.id === selectedDataSources.destination,
        );
        if (dataSource && !dataSource.decodedContents)
          await getFileContents(dataSource);
      }
    };
    fetchContents();
  }, [selectedDataSources.source, selectedDataSources.destination]);

  const handleSelectChange =
    (index: 'source' | 'destination') =>
      (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDataSources((prev) => ({
          ...prev,
          [index]: event.target.value,
        }));
      };

  interface SelectedColumns {
    joining: { first: string | null; second: string | null };
  }

  const [selectedColumns, setSelectedColumns] = useState<SelectedColumns>({
    joining: { first: null, second: null },
  });

  const handleColumnSelect = (dataSourceId: string, column: string) => {
    if (
      dataSourceId === selectedDataSources.source &&
      selectedColumns.joining.first === null
    ) {
      setSelectedColumns((prev) => ({
        ...prev,
        joining: {
          ...prev.joining,
          first: `assoc_${dataSources.find((ds) => ds.id === selectedDataSources.destination)
            ?.name
            }`,
          second: column,
        },
      }));
    } else if (dataSourceId === selectedDataSources.source) {
      setSelectedColumns((prev) => ({
        ...prev,
        joining: { ...prev.joining, second: column },
      }));
    }
  };

  const isSelectedColumn = (dataSourceId: string, columnKey: string) => {
    return (
      (dataSourceId === selectedDataSources.source &&
        selectedColumns.joining.second === columnKey) ||
      (dataSourceId === selectedDataSources.destination &&
        columnKey ===
        `assoc_${dataSources.find((ds) => ds.id === selectedDataSources.source)?.name
        }`)
    );
  };

  const {
    isLoading: registryAssociationLoading,
    error,
    saveAssociation,
  } = useRegistryAssociations();

  const initiateSaveAssociation = async () => {
    const association = {
      dataSources: [
        selectedDataSources.source,
        selectedDataSources.destination,
      ],
      selectedColumns: selectedColumns,
      id: uuidv4(),
    };

    await saveAssociation(association);
    onClose();
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Add Association"
    >
      <div className="flex flex-col">
        {isLoading ? (
          <div className="mt-4 py-4 flex justify-center">
            {/* Replace this with your preferred spinner solution */}
            <div className="spinner size-2xl text-gray-600"></div>
          </div>
        ) : (
          <div className="flex flex-col w-full">
            <div className="flex w-full">
              <select
                className="w-1/3 mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                onChange={handleSelectChange('source')}
              >
                {dataSources.map((dataSource) => (
                  <option key={dataSource.id} value={dataSource.id}>
                    {dataSource.name}
                  </option>
                ))}
              </select>
              <select
                className="ml-4 w-1/3 mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                onChange={handleSelectChange('destination')}
              >
                {dataSources.map((dataSource) => (
                  <option key={dataSource.id} value={dataSource.id}>
                    {dataSource.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-10 flex w-full justify-around">
              {dataSources
                .filter((ds) =>
                  [selectedDataSources.source, selectedDataSources.destination].includes(ds.id),
                )
                .map((dataSource) => (
                  <div key={dataSource.id} className="flex flex-col">
                    <div className="font-bold mb-4">
                      {dataSource.name}:
                    </div>
                    <div
                      className="overflow-x-auto border border-gray-200 rounded-md p-4 w-full h-full"
                      style={{ maxWidth: '500px', maxHeight: '500px' }}
                    >
                      {dataSource.decodedContents ? (
                        <table className="min-w-full divide-y divide-gray-200">
                          <caption>{dataSource.name}</caption>
                          <thead>
                            <tr>
                              {dataSource.id === selectedDataSources.destination && (
                                <th className="bg-blue-100 py-3 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                                  assoc_{dataSources.find((ds) => ds.id === selectedDataSources.source)?.name}
                                </th>
                              )}
                              {Object.keys(dataSource.decodedContents[0] || {}).map((key, index) => (
                                <th
                                  key={index}
                                  onClick={() => handleColumnSelect(dataSource.id, key)}
                                  className={`py-3 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 ${isSelectedColumn(dataSource.id, key) ? 'bg-blue-100' : 'transparent'}`}
                                  style={{ cursor: 'pointer' }}
                                >
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {dataSource.decodedContents.map((row:any, rowIndex:any) => (
                              <tr key={rowIndex}>
                                {dataSource.id === selectedDataSources.destination && (
                                  <td className="bg-blue-100"></td>
                                )}
                                {Object.keys(row).map((key, valueIndex) => (
                                  <td
                                    key={valueIndex}
                                    className={`border-b border-gray-200 ${isSelectedColumn(dataSource.id, key) ? 'bg-blue-100' : 'transparent'}`}
                                  >
                                    {typeof row[key] === 'string' || typeof row[key] === 'number' ? row[key] : null}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-gray-500">Fetching contents...</div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        {/* New container for displaying selected columns and filters */}
        <div className="mt-10">
          <div className="text-lg mb-2">
            Selected Columns
          </div>
          <div className="mb-4">
            <div className="font-bold">Joining Columns:</div>
            <div>
              {selectedColumns.joining.first}, {selectedColumns.joining.second}
            </div>
          </div>
          <div className="mb-4">
            <div className="font-bold">Filters:</div>
            <select className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="coming_soon">Coming soon</option>
            </select>
          </div>
        </div>
      </div>
      <ModalButtons onClose={onClose}
        handleConnect={initiateSaveAssociation}
        connectBtnText='Add'
      />
    </ModalWrapper>
  );
};

export default AddAssociationModal;
