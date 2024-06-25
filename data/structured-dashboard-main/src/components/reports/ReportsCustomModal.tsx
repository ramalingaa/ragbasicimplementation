import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  List,
  ListItem,
  Flex,
  Icon,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { MdSchema } from 'react-icons/md';
import {
  FaQuestionCircle,
  FaTrash,
  FaAngleUp,
  FaAngleDown,
} from 'react-icons/fa';
import { BsFileEarmarkSpreadsheetFill } from 'react-icons/bs';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import useFetchDataSources from 'hooks/harbor/useFetchDataSources';

interface ReportsCustomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportsCustomModal: React.FC<ReportsCustomModalProps> = ({
  isOpen,
  onClose,
}) => {
  const overlayStyle: React.CSSProperties = {
    display: isOpen ? 'block' : 'none',
    position: 'fixed',
    zIndex: 10,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  };

  const contentStyle: React.CSSProperties = {
    backgroundColor: '#fefefe',
    marginTop: '10%',
    marginLeft: '30%',
    width: '40%', // Adjusted width for this modal
    padding: '20px',
    borderRadius: '10px',
    zIndex: 11,
  };

  const { dataSources, setReportsChosenDataSource, reportsChosenDataSource } =
    useHarborStore((state) => ({
      dataSources: state.dataSources,
      setReportsChosenDataSource: state.setReportsChosenDataSource,
      reportsChosenDataSource: state.reportsChosenDataSource,
    }));
  const { errorMessage, isLoading } = useFetchDataSources();

  const handleDataSourceSelect = (dataSource: any) => {
    setReportsChosenDataSource(dataSource);
  };

  return (
    <div style={overlayStyle}>
      <div style={contentStyle}>
        <Text fontSize="xl" fontWeight="200" lineHeight="100%" mb={10}>
          Sources
        </Text>
        {isLoading ? (
          <div className="mt-4 py-4 flex justify-center items-center h-full">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-gray-600"
              role="status">
              <span
                className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
              >Loading...</span>
            </div>
          </div>
        ) : (
          <List>
            {dataSources.length === 0 ? (
              <Text textAlign={'left'}>No Data Sources connected yet</Text>
            ) : (
              dataSources.map((source) => (
                <Flex key={source.id} mt={2} mb={2} alignItems="center">
                  <ListItem
                    bg={
                      reportsChosenDataSource?.id === source.id
                        ? 'gray.300'
                        : 'secondaryGray.300'
                    } // Highlight selected data source
                    cursor="pointer"
                    p={2}
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    flex="1"
                    onClick={() => handleDataSourceSelect(source)} // Set selected data source on click
                  >
                    <Icon
                      as={
                        source.type === 'csv'
                          ? BsFileEarmarkSpreadsheetFill
                          : FaQuestionCircle // Default icon for other types
                      }
                      boxSize="16px"
                      ml={2}
                    />
                    <Text ml={2} flex="1">
                      {source.name}
                    </Text>
                  </ListItem>
                </Flex>
              ))
            )}
          </List>
        )}
        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="gray" onClick={onClose}>
            Add
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default ReportsCustomModal;
