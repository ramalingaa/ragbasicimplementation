import React from 'react';
import {
  Button,
  Flex,
  Box,
  Text,
  IconButton,
  Input,
  Spinner,
} from '@chakra-ui/react';
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import { MdPrint } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';
import { EditIcon } from '@chakra-ui/icons';
import { useReportsStore } from '../../zustand/reports/reportsStore';
import useReports from 'hooks/reports/useReports';
import GeneratedReportContainer from './GeneratedReportContainer';
import useFetchReports from 'hooks/reports/useFetchReports';

interface ReportsHistoryCustomDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportsHistoryCustomDrawer: React.FC<ReportsHistoryCustomDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1200,
    display: isOpen ? 'block' : 'none',
  };

  const drawerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '400px',
    height: '100%',
    background: 'white',
    zIndex: 1300,
    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease',
  };

  const {
    generatedReports,
    setToggleReportIsOpen,
    toggleEditingOverallName,
    updateOverallReportName,
  } = useReportsStore();

  const handleToggleReportOpen = (reportId: string) => {
    setToggleReportIsOpen(reportId);
  };

  const { deleteReport, updateCompleteReport } = useReports();

  const { isLoading } = useFetchReports();

  return (
    <>
      <div style={overlayStyle} onClick={onClose} />
      <Box style={drawerStyle}>
        <Flex direction="column" p="4" h={'100%'}>
          <Text fontWeight="bold" mb={4}>
            Reports History
          </Text>
          {isLoading ? (
            <Flex justify="center" align="center" height="200px">
              <Spinner size="xl" />
            </Flex>
          ) : generatedReports.length === 0 ? (
            <Text>No generated reports yet</Text>
          ) : (
            generatedReports.map((report) => (
              <Box
                key={report.reportId}
                mb={4}
                border="1px"
                borderColor="gray.300"
                borderRadius="md"
                p={4}
                w={'100%'}
              >
                <Flex justifyContent="space-between" alignItems="center">
                  <Flex>
                    {report.isEditingOverallName ? (
                      <Input
                        value={report.overallReportName}
                        onChange={(e) =>
                          updateOverallReportName(
                            report.reportId,
                            e.target.value,
                          )
                        }
                        size="lg"
                        mr={2}
                      />
                    ) : (
                      <Text fontWeight="bold">{report.overallReportName}</Text>
                    )}

                    {report.isEditingOverallName ? (
                      <Button
                        colorScheme="brandColorScheme"
                        aria-label="Save"
                        onClick={() => {
                          toggleEditingOverallName(report.reportId);
                          updateCompleteReport(report);
                        }}
                        variant="outline"
                        size="lg"
                        mr={2}
                      >
                        Save
                      </Button>
                    ) : (
                      <IconButton
                        icon={<EditIcon />}
                        colorScheme="brandColorScheme"
                        aria-label="Edit"
                        onClick={() => {
                          toggleEditingOverallName(report.reportId);
                        }}
                        variant="outline"
                        size="xs"
                        color="lightgray"
                        ml={2}
                        mt={3}
                      />
                    )}
                  </Flex>

                  <Flex>
                    <Box mr={4}>
                      <IconButton
                        onClick={() => deleteReport(report.reportId)}
                        icon={<FaTrash />}
                        colorScheme="brandColorScheme"
                        aria-label="Delete"
                        variant="outline"
                        size="xs"
                        color="lightgray"
                        ml={2}
                        mt={2}
                      />
                    </Box>

                    <IconButton
                      icon={
                        report.isReportOpen ? <FaAngleUp /> : <FaAngleDown />
                      }
                      onClick={() => handleToggleReportOpen(report.reportId)}
                      aria-label="Toggle Log Conversation"
                    />
                  </Flex>
                </Flex>
                {report.isReportOpen && (
                  <Box maxHeight="400px" overflowY="auto">
                    <GeneratedReportContainer
                      reportSummary={report.setReportSummary}
                      reports={report.reports}
                      inHistory={true}
                    />
                  </Box>
                )}
              </Box>
            ))
          )}
          <Button onClick={onClose} marginTop="auto">
            Close
          </Button>
        </Flex>
      </Box>
    </>
  );
};

export default ReportsHistoryCustomDrawer;
