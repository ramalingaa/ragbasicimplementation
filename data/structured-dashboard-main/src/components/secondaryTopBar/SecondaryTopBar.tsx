import {
  DeleteSourcesBtn,
  ImFeelingLuckyBtn,
  ReportsPageNewBtn,
  ViewHideThreadsToggle,
} from './toggleComponents';

import ConnectDataSource from 'components/harbor/ConnectDataSource';
import { ListGraphViewToggleSingleButton } from 'components/harbor/ListGraphViewToggle';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import useJoinTables from 'hooks/harbor/useJoinTables';
import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useReportsStore } from '../../zustand/reports/reportsStore';
import { useSidebarStore } from '../../zustand/app/appStore';
import { FaPlus } from 'react-icons/fa';
import { useBlocksStore } from '../../zustand/blocks/blocksStore';
import QueriesPageDataSourceSelectionDropDown from 'components/queries/QueriesCustomModal';
import { useConfirmationMessageStore } from '../../zustand/confirmationMessage/confirmationMessageStore';
import HarborDropdownSelector from './HarborDropdownSelector';
import useEntityTypes from 'hooks/harbor/useEntityTypes';
import { BiLogoPostgresql } from 'react-icons/bi';
import useUnits from 'hooks/harbor/useUnits';
import UnitsSearchInputBox from './UnitsSearchInputBox';
import useHomeReport from 'hooks/reports/useHomeReport';
import useFetchDataSources from 'hooks/harbor/useFetchDataSources';

const SecondaryTopBar = () => {
  const pathname = usePathname();

  const routeName = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const name = pathSegments[pathSegments.length - 1];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }, [pathname]);

  const { selectedDataSources, componentView } = useHarborStore();
  const showJoinBtn = selectedDataSources.length >= 2;

  const { isDrawerOpen, setIsDrawerOpen } = useReportsStore();
  const isSidebarOpen = useSidebarStore((state) => state.isSidebarOpen);

  return (
    <div
      className={`fixed z-10 top-12 h-12 mt-[-1px] flex items-center justify-between px-4 bg-white border-t border-b border-[#eeeff1] w-fill-available`}
    >
      <div
        className="w-full h-full flex items-center justify-start px-2 bg-white"
        id="secondary-top-bar-left-part"
      >
        {routeName.toLowerCase() === 'harbor' && <HarborDropdownSelector />}
      </div>
      <div
        className="w-full h-full flex items-center justify-end pl-2 bg-white gap-x-2"
        id="secondary-top-bar-right-part"
      >
        {routeName.toLowerCase() === 'harbor' && componentView == 'unit' && (
          <UnitsSearchInputBox />
        )}
        {routeName.toLowerCase() === 'harbor' &&
          componentView == 'source' &&
          showJoinBtn && <JoinButton />}
        {routeName.toLowerCase() === 'harbor' && componentView == 'unit' && (
          <GenerateUnitsBtns />
        )}
        {routeName.toLowerCase() === 'harbor' &&
          componentView == 'source' &&
          selectedDataSources.length > 0 && <DeleteSourcesBtn />}
        {routeName.toLowerCase() === 'harbor' &&
          (componentView == 'source' || componentView == 'type') && (
            <ListGraphViewToggleSingleButton />
          )}
        {routeName.toLowerCase() === 'harbor' && componentView == 'type' && (
          <GenerateEntityBtns />
        )}
        {routeName.toLowerCase() === 'queries' && <ViewHideThreadsToggle />}
        {['harbor'].includes(routeName.toLowerCase()) &&
          componentView == 'source' && <ConnectDataSource />}
        {/* {routeName.toLowerCase() === 'queries' && <NewThreadButton />} */}
        {routeName.toLowerCase() === 'queries' && (
          <QueriesPageDataSourceSelectionDropDown />
        )}
        {/* {routeName.toLowerCase() === 'reports' && <ImFeelingLuckyBtn />} */}
        {routeName.toLowerCase() === 'reports' && <ReportsPageNewBtn />}
        {routeName.toLowerCase() === 'home' && <HomeReportRegenerateBtn />}
        {routeName.toLowerCase() === 'blocks' && <BlocksPageNewBtn />}
      </div>
    </div>
  );
};

const BlocksPageNewBtn: React.FC = () => {
  const {
    setIsBlockCreationModalOpen,
    setBlocksChosenTemplate,
    setBlocksChosenDataSource,
    setBlockCreationName,
  } = useBlocksStore();

  return (
    <button
      onClick={() => {
        setBlocksChosenDataSource(null);
        setBlocksChosenTemplate(null);
        setBlockCreationName('');
        setIsBlockCreationModalOpen(true);
      }}
      className="max-w-fit inline-flex w-full items-center text-white justify-center gap-x-1.5 rounded-md bg-blue-500 px-3 py-1 text-sm font-semibold shadow-sm hover:bg-[#2064e4] border border-blue-500 h-[1.75rem]"
    >
      <FaPlus size={'0.75rem'} />
      New
    </button>
  );
};

const HomeReportRegenerateBtn = () => {
  const { getOverallReportNameStreamed } = useHomeReport();
  const { dataSources } = useHarborStore();
  const { errorMessage, isLoading } = useFetchDataSources();
  const { homeReport } = useReportsStore();
  const isDisabled =
    dataSources.length === 0 || isLoading || homeReport.isGenerating;

  return (
    <button
      className={`max-w-fit inline-flex items-center text-gray-500 justify-center gap-x-1.5 rounded-md px-2 py-1 text-sm font-semibold hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 h-[1.75rem] ${
        isDisabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={() => getOverallReportNameStreamed('', '')}
      disabled={isDisabled}
    >
      {isLoading || homeReport.isGenerating ? (
        <svg
          className="animate-spin h-4 w-4 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      )}
    </button>
  );
};

const GenerateUnitsBtns = () => {
  const { generatePsqlUnits, isLoading } = useUnits();
  return (
    <button
      className="text-sm px-4 rounded-md bg-black h-[1.75rem] text-white hover:bg-white hover:text-gray-800 border-black border-[1px] border-md transition duration-300 ease-in-out font-medium"
      onClick={async () => {
        await generatePsqlUnits();
      }}
    >
      {isLoading ? 'Loading...' : 'Generate'}
    </button>
  );
};

const GenerateEntityBtns = () => {
  const { generateEntityTypes, isLoading } = useEntityTypes();
  return (
    <button
      className="text-sm px-4 rounded-md bg-black h-[1.75rem] text-white hover:bg-white hover:text-gray-800 border-black border-[1px] border-md transition duration-300 ease-in-out font-medium"
      onClick={async () => {
        await generateEntityTypes();
      }}
    >
      {isLoading ? 'Loading...' : 'Generate'}
    </button>
  );
};

const JoinButton = () => {
  const { selectedDataSources } = useHarborStore();
  const { isLoading, joinMultipleTables } = useJoinTables();
  const { setConfirmationMessage } = useConfirmationMessageStore();

  const handleJoin = async () => {
    const join_result = await joinMultipleTables();
  };
  console.log({ selectedDataSources });
  return (
    <button
      className="text-sm px-4 rounded-md bg-black h-[1.75rem] text-white hover:bg-white hover:text-gray-800 border-black border-[1px] border-md transition duration-300 ease-in-out font-medium"
      onClick={() => {
        setConfirmationMessage(
          'Join Data Sources?',
          `Combining files: ${selectedDataSources
            .map((ds) => ds.name)
            .join(', ')}`,
          async () => await handleJoin(),
          isLoading,
          'Join',
          undefined,
          'Cancel',
          true,
        );
      }}
    >
      {isLoading ? 'Loading...' : 'Join'}
    </button>
  );
};

const BlocksPageNewButton: React.FC = () => {
  const {
    setIsBlockCreationModalOpen,
    setBlocksChosenTemplate,
    setBlocksChosenDataSource,
  } = useBlocksStore();

  return (
    <button
      onClick={() => {
        setBlocksChosenDataSource(null);
        setBlocksChosenTemplate(null);
        setIsBlockCreationModalOpen(true);
      }}
      className="max-w-fit inline-flex w-full items-center text-white justify-center gap-x-1.5 rounded-md bg-blue-500 px-3 py-1 text-sm font-semibold shadow-sm hover:bg-[#2064e4] border border-blue-500 h-[1.75rem]"
    >
      <FaPlus size={'0.75rem'} /> New
    </button>
  );
};

export default SecondaryTopBar;
