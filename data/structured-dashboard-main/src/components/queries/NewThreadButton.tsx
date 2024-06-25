import { FaPlus } from 'react-icons/fa';
import React from 'react';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useQueriesState } from '../../zustand/queries/queriesStore';
import { useReportsStore } from '../../zustand/reports/reportsStore';

const NewThreadButton: React.FC = () => {
  const { setSelectedDrillDownReport, setQueryReport } = useReportsStore();

  const { setCurrentQueryConversation, setCurrentCarouselIndex } =
    useQueriesState();

  const {
    setReportsChosenDataSource,
  } = useHarborStore();

  const createNewThread = () => {
    setCurrentCarouselIndex(0);
    setSelectedDrillDownReport(null);
    setQueryReport(null);
    setReportsChosenDataSource(null);
    setCurrentQueryConversation(null);
  };

  return (
    <button
      onClick={createNewThread}
      className="max-w-fit inline-flex w-full items-center text-white justify-center gap-x-1.5 rounded-md bg-blue-500 px-3 py-1 text-sm font-medium shadow-sm hover:bg-[#2064e4] border border-blue-500 h-[1.75rem]">
      <FaPlus size={'0.75rem'} /> New
    </button>
  );
};

export default NewThreadButton;
