import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { FaFileCsv, FaSalesforce, FaTable, FaHubspot } from 'react-icons/fa';
import { TbBrandGoogleBigQuery } from "react-icons/tb";
import {
  ColDef,
  SelectionChangedEvent,
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
} from 'ag-grid-community';
import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AgGridReact } from 'ag-grid-react';
import { DataSource } from 'interfaces/DataTypes';
import DataViewModal from './DataViewModal';
import MetadataModal from './MetadataModal';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useAuthStore } from 'zustand/auth/authStore';
import useDisclosure from 'hooks/useDisclosure';
import { FaRegSnowflake } from "react-icons/fa";
import { BiLogoPostgresql } from 'react-icons/bi';
import { SiAmazons3 } from 'react-icons/si';
import { FaDownload } from "react-icons/fa6";
import useUpdateDatasourceDescription from 'hooks/harbor/useUpdateDatasourceDescription';
import { uploaderEmailFormatter } from 'utils/formatters';
import Associations from './Associations';

const Tag = ({ children }: { children: ReactNode }) => {
  return (
    <span className='px-1 rounded-md bg-[#bee3f8] text-[#2a4365]'>{children}</span>
  )
}

export const getSourceIcon = (type: string) => {
  switch (type) {
    case 'csv':
      return <FaFileCsv className="text-blue-500" />;
    case 'salesforce':
      return <FaSalesforce className="text-blue-400" />;
    case 'spreadsheet':
      return <FaTable color="pink" />;
    case 'bigquery':
      return <TbBrandGoogleBigQuery color="blue" />;
    case 'hubspot':
      return <FaHubspot color="orange" />;
    case 'snowflake':
      return <FaRegSnowflake className="text-[#67afea]" />;
    case 'postgresql':
      return <BiLogoPostgresql className="text-[#0064a5]" />;
    case 'amazonS3':
      return <SiAmazons3 className="text-[#FF7A59]" />;
    default:
      return <FaTable color="gray" />;
  }
};

const FileSystemTable = ({ dataSources }: { dataSources: DataSource[] }) => {
  const [topGridApi, setTopGridApi] = useState<any>(null);
  const [bottomGridApi, setBottomGridApi] = useState<any>(null);
  const { selectedDataSources, setSelectedDataSources, setDataSources, originalSources,
    setOriginalSources,
    joinedSources,
    setJoinedSources, } = useHarborStore();
  const topGrid = useRef<AgGridReact>(null);
  const bottomGrid = useRef<AgGridReact>(null);

  const [topGridSelectedDatasources, setTopGridSelectedDatasources] = useState<DataSource[]>([]);
  const [bottomGridSelectedDatasources, setBottomGridSelectedDatasources] = useState<DataSource[]>([]);

  useEffect(() => {
    if (dataSources) {
      setOriginalSources(dataSources.filter(dataSource => dataSource.fileMetadata.source !== 'join'));
      setJoinedSources(dataSources.filter(dataSource => dataSource.fileMetadata.source === 'join'));
      setTopGridSelectedDatasources(
        topGridSelectedDatasources.filter((dataSource) => dataSources.includes(dataSource))
      );
      setBottomGridSelectedDatasources(
        bottomGridSelectedDatasources.filter((dataSource) => dataSources.includes(dataSource))
      );
    }
    setSelectedDataSources([]);
  }, [dataSources]);

  useEffect(() => {
    if (topGridApi) {
      // Automatically select rows with IDs 1 and 3
      topGridApi.forEachNode((node:any) => {
        selectedDataSources.map((dataSource) => dataSource.id).includes(node.data.id) ? node.setSelected(true) : node.setSelected(false);
      });
    }
  }, [selectedDataSources])

  const { user, isLoading } = useAuthStore();

  const {
    isOpen: isOpenMetadataViewModal,
    onOpen: onOpenMetadataViewModal,
    onClose: onCloseMetadataViewModal,
  } = useDisclosure();

  const {
    isDataViewModalOpen,
    onOpenDataViewModal,
    onCloseDataViewModal,
  } = useHarborStore();

  const selectedDataSource = useHarborStore((state) => state.selectedDataSourceOnDataView);
  const setSelectedDataSource = useHarborStore((state) => state.setSelectedDataSourceOnDataView);

  const onGridReady = useCallback((params: any, setGridApi: any) => {
    params.api.sizeColumnsToFit();
    setGridApi(params.api);
  }, []);

  const onSelectionChanged = useCallback((api: any, isTopGrid: boolean) => {
    const allSelectedNodes = api.getSelectedNodes();
    const newSelectedData = allSelectedNodes.map((node: any) => node.data);

    let finalSelectedData: DataSource[] = [];
    if (isTopGrid) {
      finalSelectedData = [...new Set([...bottomGridSelectedDatasources, ...newSelectedData])];
      setTopGridSelectedDatasources(newSelectedData);
    } else {
      finalSelectedData = [...new Set([...topGridSelectedDatasources, ...newSelectedData])];
      setBottomGridSelectedDatasources(newSelectedData);
    }
    console.log('finalSelectedData', finalSelectedData);
    setSelectedDataSources(finalSelectedData);
  }, [setSelectedDataSources, setTopGridSelectedDatasources, setBottomGridSelectedDatasources, topGridSelectedDatasources, bottomGridSelectedDatasources]);

  const onTopGridSelectionChanged = useCallback((event: any) => {
    onSelectionChanged(event.api, true);
  }, [onSelectionChanged]);

  const onBottomGridSelectionChanged = useCallback((event: any) => {
    onSelectionChanged(event.api, false);
  }, [onSelectionChanged]);

  const versionRenderer = (params: any) => {
    if (!params.data.fileMetadata?.version) return '-';
    return (
      <div className='flex h-full items-center justify-center w-full text-sm'>
        <Tag>
          v{params.data.fileMetadata?.version}
        </Tag>
      </div>
    );
  };

  const uploadTimeRenderer = (params: any) => {
    if (!params.data.fileMetadata?.uploadTime) {
      return '-';
    }
    function formatDate(inputDate: string): string {
      const date = new Date(inputDate);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = String(date.getFullYear());
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      return `${month}/${day}/${year} ${hours}:${minutes}`;
    }
    return <span className='text-sm'>{formatDate(params.data.fileMetadata?.uploadTime)}</span>
  };

  const SourceNameCellRenderer = (params: any) => {
    return (
      <div className="flex w-full items-center">
        <a
          className='flex flex-row items-center justify-start text-sm hover:bg-gray-200 max-w-fit pl-2 pr-1 py-1 rounded-md'
          onClick={() => {
            setSelectedDataSource(params.data);
            onOpenDataViewModal();
          }}
        >
          <div className='flex flex-row items-center justify-center mr-3 text-sm'>
            <div className='flex flex-row items-center justify-center mr-3 text-sm'>
              {getSourceIcon(params.data?.fileMetadata?.source || 'csv')}
            </div>
            <div className="flex flex-col">
              {params.data.name}
              <hr className="border-t border-gray-200" />
            </div>
          </div>
        </a>
      </div>
    );
  };

  const fileSizeRenderer = (params: any) => {
    const formatBytes = (bytes: number, decimals = 2) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    return <span className='text-sm'>{params.data.fileMetadata?.size
      ? formatBytes(params.data.fileMetadata?.size)
      : '-'}</span>
  };

  const uploadedByRenderer = (params: any) => {
    return (
      <div className='flex items-center self-center h-full'>
        {/* <img
          className='rounded-full w-[1rem] h-[1rem] mr-2'
          src={user?.picture ?? ''}
          alt="Profile"
        /> */}
        <span
          className='text-sm font-normal max-w-36'
        >
          {isLoading ? 'Loading...' : (user && params.data.uploaderEmail !== "") ? uploaderEmailFormatter(params.data.uploaderEmail) : 'Unknown User'}
        </span>
      </div>
    );
  };

  const descriptionRenderer = () => {
    return <span className='max-w-36 font-semibold'></span>;
  };

  const typeRenderer = () => {
    return (
      <div className='flex h-full items-center justify-center w-full text-sm'>
        <Tag>
          Original
        </Tag>
      </div>
    );
  };

  const {
    saveDescription
  } = useUpdateDatasourceDescription();
  const { harborViewMode } = useHarborStore();

  const { sourcesTableAndGraphViewSideBySide } = useHarborStore();
  const columns = useMemo(
    () => [
      {
        headerName: 'Source',
        field: 'name',
        filter: true,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        cellRenderer: SourceNameCellRenderer,
        minWidth: sourcesTableAndGraphViewSideBySide ? 175 : 350,
        maxWidth: sourcesTableAndGraphViewSideBySide ? 180 : 360,
        pinned:   sourcesTableAndGraphViewSideBySide ? '' : 'left',
      },
      {
        headerName: 'Connected Date',
        field: 'connectedDate',
        cellRenderer: uploadTimeRenderer,
        minWidth: sourcesTableAndGraphViewSideBySide ? 100 : 200,
        maxWidth: sourcesTableAndGraphViewSideBySide ? 110 : 210,
        resizable: false,
      },
      {
        headerName: 'Size',
        field: 'size',
        cellRenderer: fileSizeRenderer,
        minWidth: sourcesTableAndGraphViewSideBySide ? 60 : 120,
        maxWidth: sourcesTableAndGraphViewSideBySide ? 70 : 130,
        resizable: false,
      },
      {
        headerName: 'Connected By',
        field: 'connectedBy',
        cellRenderer: uploadedByRenderer,
        minWidth: sourcesTableAndGraphViewSideBySide ? 125 : 250,
        maxWidth: sourcesTableAndGraphViewSideBySide ? 130 : 260,
        resizable: false,
      },
      {
        headerName: 'Description',
        field: 'description',
        minWidth: sourcesTableAndGraphViewSideBySide ? 300 : 600,
        maxWidth: sourcesTableAndGraphViewSideBySide ? 310 : 610,
        valueGetter: (params: any) => {
          return dataSources.find((dataSource) => dataSource.id === params.data.id)?.fileMetadata.description || '';
        },
        cellClass: 'text-sm',
        valueSetter: (params: any) => {
          try {
            setDataSources(
              dataSources.map((dataSource) => {
                if (dataSource.id === params.data.id) {
                  dataSource.fileMetadata.description = params.newValue;
                }
                return dataSource;
              })
            )
            const success = saveDescription(params.data.id, params.newValue);
            return true;
          } catch (error) {
            console.error(error);
            return false;
          }
        },
        editable: true,
        suppressClickEdit: true,
        resizable: false,
      },
    ],
    [sourcesTableAndGraphViewSideBySide],
  );
  const containerStyle = useMemo(
    () => ({ width: '100%', height: '100%', agBorders: 'none', display: 'contents' }),
    [],
  );
  const autoSizeStrategy = useMemo<
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy
  >(() => {
    return {
      type: 'fitGridWidth',
    };
  }, []);
  const rowStyle = { background: 'white' };
  return (
    <div style={containerStyle}>
      <div
        className={`ag-theme-alpine flex flex-col h-full filesystem-table-container bg-white overflow-y-scroll`}
      >
        <div className='top-grid-filesystem-table-container'>
          <AgGridReact
            ref={topGrid}
            rowData={originalSources}
            columnDefs={columns as any}
            rowSelection="multiple"
            onGridReady={params => onGridReady(params, setTopGridApi)}
            onSelectionChanged={onTopGridSelectionChanged}
            rowStyle={rowStyle}
            autoSizeStrategy={autoSizeStrategy}
            alwaysShowVerticalScroll={true}
            rowMultiSelectWithClick={false}
            rowHeight={38}
            alwaysShowHorizontalScroll={false}
            domLayout='autoHeight'
            masterDetail={true}
            gridOptions={{
              alignedGrids: [bottomGrid],
              suppressRowHoverHighlight: true,
            }}
          />
        </div>
        {joinedSources && joinedSources?.length > 0 &&
          < div className='bottom-grid-filesystem-table-container border-t border-[#eeeff1]'>
            <AgGridReact
              ref={bottomGrid}
              rowData={joinedSources}
              columnDefs={columns as any}
              rowSelection="multiple"
              onGridReady={params => onGridReady(params, setBottomGridApi)}
              onSelectionChanged={onBottomGridSelectionChanged}
              rowStyle={rowStyle}
              autoSizeStrategy={autoSizeStrategy}
              masterDetail={true}
              alwaysShowVerticalScroll={true}
              rowMultiSelectWithClick={false}
              alwaysShowHorizontalScroll={false}
              domLayout='autoHeight'
              rowHeight={38}
              gridOptions={{
                alignedGrids: [topGrid],
                suppressRowHoverHighlight: true,
              }}
            />
          </div>
        }
      </div>
    </div >
  )
};

export default FileSystemTable;
