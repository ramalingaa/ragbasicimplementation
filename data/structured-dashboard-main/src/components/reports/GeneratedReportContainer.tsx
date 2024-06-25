import { Box, Flex, Text, Grid } from '@chakra-ui/react';
import React from 'react';
import ReportsChart from './ReportsChart';
import useThemeColors from 'hooks/useThemeColors';
import * as echarts from 'echarts';
type EChartsOption = echarts.EChartsOption;

export type ChartType = 'line' | 'bar' | 'scatter' | 'pie' | 'radar' | 'map' | 'tree' | 'treemap' | 'graph' | 'gauge' | 'funnel' | 'parallel' | 'sankey' | 'boxplot' | 'candlestick' | 'effectScatter' | 'lines' | 'heatmap' | 'pictorialBar' | 'themeRiver' | 'sunburst';

export type ChartInfo = {
  type: ChartType,
  options: EChartsOption;
};

interface Report {
  reportName: string;
  question: string;
  answer: string;
  chartInfo?: ChartInfo;
}

interface GeneratedReportContainerProps {
  reportSummary: string;
  reports: Report[];
  inHistory?: boolean;
}

const GeneratedReportContainer: React.FC<GeneratedReportContainerProps> = ({
  reportSummary,
  reports,
  inHistory = false,
}) => {
  const { themeContainerBgColor } = useThemeColors();

  return (
    <Box width="100%">
      {reportSummary && (
        <Box
          mt={4}
          borderRadius="md"
          p={4}
          border="1px"
          borderColor="gray.300"
          bg={themeContainerBgColor}
          textAlign="left"
          whiteSpace="pre-line"
        >
          {reportSummary}
        </Box>
      )}
      {inHistory ? (
        <Flex direction="column" mt={4}>
          {reports?.map((report, index) => (
            <Box key={index} width="100%" mb={4}>
              <Flex
                direction="column"
                borderRadius="md"
                p={4}
                border="1px"
                borderColor="gray.300"
                bg={themeContainerBgColor}
                textAlign="left"
                whiteSpace="pre-line"
              >
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  {report.reportName}
                </Text>
                <Box mb={6}>
                  <Text>{report.question}</Text>
                  <Text fontWeight={'bold'}>{report.answer}</Text>
                </Box>
                <ReportsChart chartInfo={report.chartInfo} />
              </Flex>
            </Box>
          ))}
        </Flex>
      ) : (
        <Grid templateColumns="repeat(2, 1fr)" gap={4} mt={4}>
          {reports?.map((report, index) => (
            <Box key={index} width="100%">
              <Flex
                direction="column"
                borderRadius="md"
                p={4}
                border="1px"
                borderColor="gray.300"
                bg={themeContainerBgColor}
                textAlign="left"
                whiteSpace="pre-line"
                justifyContent={'space-around'}
              >
                <Text fontSize="lg" fontWeight="bold" mb={2}>
                  {report.reportName}
                </Text>
                <Box mb={6}>
                  <Text>{report.question}</Text>
                  <Text fontWeight={'bold'}>{report.answer}</Text>
                </Box>
                <ReportsChart chartInfo={report.chartInfo} />
              </Flex>
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default GeneratedReportContainer;
