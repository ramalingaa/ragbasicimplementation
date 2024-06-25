'use client';

import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { Fragment } from 'react';
import React, { useRef, useEffect } from 'react';
import { useQueriesState } from '../../zustand/queries/queriesStore';
import * as echarts from 'echarts';
import { ChartInfo } from './GeneratedReportContainer';

const ReportsChart = ({ chartInfo }: { chartInfo: ChartInfo }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const queryConversationHistory = useQueriesState(
    (state) => state.queryConversationHistory,
  );
  const { currentQueryConversation, currentCarouselIndex } = useQueriesState();

  useEffect(() => {
    if (chartRef.current && chartInfo.options?.series) {
      const chartInstance = echarts.init(chartRef.current);

      try {
        const seriesOption = Array.isArray(chartInfo.options.series) ? chartInfo.options.series : [chartInfo.options.series];

        const updatedSeriesOption = seriesOption.map((series) => ({
          ...series,
          itemStyle: {
            normal: {
              color: function (params: any) {
                const colors = [
                  'rgb(255, 99, 132 , 0.4)', // Red
                  'rgb(255, 159, 64 , 0.4)', // Orange
                  'rgb(255, 205, 86 , 0.4)', // Yellow
                  'rgb(75, 192, 192 , 0.4)', // Green
                  'rgb(54, 162, 235 , 0.4)', // Blue
                  'rgb(153, 102, 255, 0.4)', // Purple
                  'rgb(201, 203, 207, 0.4)' // Gray
                ];
                return colors[params.dataIndex % colors.length];
              },
              borderColor: function (params: any) {
                const borderColors = [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(54, 162, 235)',
                  'rgb(153, 102, 255)',
                  'rgb(201, 203, 207)'
                ];
                return borderColors[params.dataIndex % borderColors.length];
              },
              borderWidth: 0.5
            }
          }
        }));
        console.log('chartInfo.options', chartInfo.options);
        // Set the chart options using spread to merge additional properties
        chartInstance.setOption({
          ...chartInfo.options,
          responsive: true,
          maintainAspectRatio: false,
          series: updatedSeriesOption,
          title: {
            show: false
          },
        });

        // Resize chart on window resize
        window.addEventListener("resize", () => {
          chartInstance.resize();
        });

      } catch (error) {
        console.error('An error occurred while creating the chart:', error);
        window.removeEventListener("resize", () => {
          chartInstance.resize();
        });
      }

      return () => {
        chartInstance.dispose();
      };
    }
  }, [chartInfo, currentQueryConversation]);

  const hasData = chartInfo.options !== null;

  if (hasData) {
    return (
      <div className='mt-6' style={{ width: '100%', height: '15rem' }}>
        <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
      </div>
    );
  }

};

export default ReportsChart;
