'use client';
import useHomeReport from 'hooks/reports/useHomeReport';
import { useEffect } from 'react';
import { useHarborStore } from 'zustand/harbor/harborStore';
import { useReportsStore } from 'zustand/reports/reportsStore';
import HomeReport from './HomeReport';

export default function HomeContainer() {
  const { dataSources, setReportsChosenDataSource } = useHarborStore();
  const { getOverallReportNameStreamed } = useHomeReport();
  const { homeReport } = useReportsStore();

  useEffect(() => {
    if (dataSources.length === 0 || homeReport.reports?.length > 0) return;
    getOverallReportNameStreamed('', '');
  }, [dataSources]);

  return (
    <div>
      <HomeReport />
    </div>
  );
}
