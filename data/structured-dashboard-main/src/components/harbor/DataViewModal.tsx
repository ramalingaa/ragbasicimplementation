'use client';

import { FaCalendarAlt, FaFileCsv } from 'react-icons/fa';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import ConnectedSourcePreview from './ConnectedSourcePreview';
import { DataSource } from 'interfaces/DataTypes';
import { MdOutlineDataUsage } from 'react-icons/md';
import {
  DataViewModalWrapper,
  ModalWrapper,
} from 'components/modal/ModalWrapper';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import DashboardHeadingWithDescription from 'components/dashboardHeadingWithDescription/DashboardHeadingWithDescription';
import CustomCard from 'components/card/Card';
import { handleDownload } from 'utils/download_helpers';
import { FaDownload } from 'react-icons/fa6';
import { AgGridReact } from 'ag-grid-react';
import {
  SizeColumnsToContentStrategy,
  SizeColumnsToFitGridStrategy,
  SizeColumnsToFitProvidedWidthStrategy,
} from 'ag-grid-community';
import useUpdateDatasourceDescription from 'hooks/harbor/useUpdateDatasourceDescription';
import Associations from './Associations';
import {
  DATASOURCES_DIR,
  ENTITY_TYPE_FILES_DIR,
  FILE_SOURCE_TYPE,
} from 'utils/constants';

interface DataViewModalProps {}

const FileMetadataDisplay = ({
  selectedDataSource,
}: {
  selectedDataSource: DataSource;
}) => {
  interface FileMetadata {
    [key: string]: string | number | any[];
  }

  const formattedFileMetadata = selectedDataSource?.fileMetadata
    ? Object.entries(selectedDataSource?.fileMetadata).reduce<FileMetadata>(
        (acc, [key, value]) => {
          if (value !== undefined && key !== 'userId') {
            acc[key] = value as string | number | any[];
          }
          return acc;
        },
        {},
      )
    : null;

  if (formattedFileMetadata && Object.keys(formattedFileMetadata).length > 0) {
    return (
      <FileDetailsComponent fileDetails={selectedDataSource?.fileMetadata} />
    );
  } else {
    <span className="text-gray-500">No metadata available</span>;
  }
};

const DataViewModal: React.FC<DataViewModalProps> = ({}) => {
  const selectedDataSource = useHarborStore(
    (state) => state.selectedDataSourceOnDataView,
  );
  const setSelectedDataSourceOnDataView = useHarborStore(
    (state) => state.setSelectedDataSourceOnDataView,
  );
  const isOpen = useHarborStore((state) => state.isDataViewModalOpen);
  const onClose = () => useHarborStore.setState({ isDataViewModalOpen: false });

  const modalTitle =
    `File: ${selectedDataSource?.fileMetadata?.fileName}` || 'Data Preview';

  const tabsInit = [
    { name: 'Data Preview', current: true },
    { name: 'Schema Preview', current: false },
    ...(selectedDataSource?.fileMetadata?.source !=
    FILE_SOURCE_TYPE.ENTITY_TYPE_GEN
      ? [{ name: 'Associations', current: false }]
      : []),
  ];

  const [tabs, setTabs] = useState(tabsInit);
  useEffect(() => {
    setTabs([
      { name: 'Data Preview', current: true },
      { name: 'Schema Preview', current: false },
      ...(selectedDataSource?.fileMetadata?.source !=
      FILE_SOURCE_TYPE.ENTITY_TYPE_GEN
        ? [{ name: 'Associations', current: false }]
        : []),
    ]);
  }, []);

  const handleClose = () => {
    setSelectedDataSourceOnDataView(null);
    onClose();
  };
  return (
    <DataViewModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title={modalTitle}
      showTitle={false}
      className="fixed inset-0 sm:w-[98%] sm:max-w-[98%]"
    >
      <FileInfoHeader
        fileDetails={
          selectedDataSource?.fileMetadata && selectedDataSource?.fileMetadata
        }
        datasource={selectedDataSource}
      />
      <TabsSelector tabs={tabs} setTabs={setTabs} />
      <div className="flex flex-row min-h-[50vh] max-h-[70vh] w-full py-4">
        {tabs.find((tab: any) => tab.current).name == 'Schema Preview' && (
          <FileMetadataDisplay selectedDataSource={selectedDataSource} />
        )}
        {tabs.find((tab: any) => tab.current).name == 'Data Preview' && (
          <ConnectedSourcePreview
            source={selectedDataSource}
            setSelectedDataSourceOnDataView={setSelectedDataSourceOnDataView}
            s3Dir={
              selectedDataSource?.fileMetadata?.source ===
              FILE_SOURCE_TYPE.ENTITY_TYPE_GEN
                ? ENTITY_TYPE_FILES_DIR
                : DATASOURCES_DIR
            }
          />
        )}
        {tabs.find((tab: any) => tab.current).name == 'Associations' && (
          <Associations />
        )}
      </div>
    </DataViewModalWrapper>
  );
};

function DownloadDatasourceBtn({ datasource }: { datasource: DataSource }) {
  return (
    <button
      onClick={() => {
        try {
          if (datasource.decodedContents && datasource.name) {
            handleDownload(datasource.decodedContents || [], datasource.name);
          } else {
            throw new Error('No data to download');
          }
        } catch (e) {
          console.error('Error downloading file', e);
        }
      }}
      className="max-w-fit inline-flex w-full items-center text-gray-500 justify-center gap-x-1.5 rounded-md px-3 py-1 text-sm font-semibold shadow-sm hover:bg-gray-500 hover:text-white border border-gray-500 h-8 mr-4 ease-in-out transition-all duration-150"
    >
      <FaDownload />
    </button>
  );
}

function FileInfoHeader({
  fileDetails,
  datasource,
}: {
  fileDetails?: FileDetails;
  datasource?: DataSource;
}) {
  const {
    fileName = 'File Name Not Available',
    size = 0,
    version = 'N/A',
    uploadTime = 'N/A',
  } = fileDetails || {};

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-row border-b border-[#eeeff1]">
      <div className="bg-white pr-4 pb-5 pl-3">
        <span className="hidden bg-purple-100 text-purple-800">
          This hidden text loads purple color on demand
        </span>
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          {fileName ? fileName : 'Filename'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Version:
          <span className="font-semibold rounded-full bg-blue-100 text-blue-800 pl-2 pr-3 py-1 text-xs justify-center ml-2">
            {' '}
            v{version}
          </span>
        </p>
        <p className="mt-1 text-sm text-gray-500">Size: {formatBytes(size)}</p>
        <p className="mt-1 text-sm text-gray-500">
          Uploaded: {new Date(uploadTime).toLocaleString()}
        </p>
      </div>
      <div className="h-full w-full flex justify-end items-end min-h-32">
        <DownloadDatasourceBtn datasource={datasource} />
      </div>
    </div>
  );
}

export interface Schema {
  columnType: string;
  columnName: string;
  description?: string;
}

const getTypeTagColorScheme = (type: string) => {
  switch (type) {
    case 'string':
      return 'blue';
    case 'datetime':
      return 'purple';
    case 'int64':
      return 'yellow';
    case 'float64':
      return 'orange';
    default:
      return 'gray';
  }
};

interface FileDetails {
  fileName: string;
  size: number;
  version: number;
  schema: Schema[];
  uploadTime: string;
  SK: string;
  PK: string;
}

const FileDetailsComponent: React.FC<{ fileDetails: FileDetails }> = ({
  fileDetails,
}) => {
  const selectedDataSourceOnDataView = useHarborStore(
    (state) => state.selectedDataSourceOnDataView,
  );

  const {
    fileName,
    size,
    version,
    schema: schemaInit,
    uploadTime,
  } = selectedDataSourceOnDataView.fileMetadata;

  const [schema, setSchema] = useState<Schema[]>(schemaInit || []);
  useEffect(() => {
    setSchema(selectedDataSourceOnDataView.fileMetadata.schema);
  }, [selectedDataSourceOnDataView]);

  const ColumnNameCellRenderer = (params: any) => {
    return (
      <div className="flex items-center text-sm ColumnNameCellRenderer">
        {getColumnIcon(params.data.columnType)}
        <span className="ml-2">{params.data.columnName}</span>
      </div>
    );
  };

  const columnTypeCellRenderer = (params: any) => {
    return (
      <span
        className={`min-w-10 px-2 inline-flex justify-start text-xs leading-5 font-semibold rounded-full bg-${getTypeTagColorScheme(
          params.data.columnType,
        )}-100 text-${getTypeTagColorScheme(params.data.columnType)}-800`}
      >
        {params.data.columnType}
      </span>
    );
  };

  const { saveDescriptionForColumnInSchema } = useUpdateDatasourceDescription();

  const columns = useMemo(
    () => [
      {
        Header: 'Column Name',
        field: 'columnName',
        minWidth: 250,
        maxWidth: 350,
        cellRenderer: ColumnNameCellRenderer,
        resizable: false,
      },
      {
        Header: 'Type',
        field: 'Type',
        cellRenderer: columnTypeCellRenderer,
        minWidth: 150,
        maxWidth: 190,
        resizable: false,
      },
      {
        Header: 'Description',
        field: 'description',
        editable: true,
        suppressClickEdit: true,
        cellClass: 'text-sm',
        resizable: false,
        minWidth: 600,
        valueGetter: (params: any) => {
          const descriptions =
            selectedDataSourceOnDataView.fileMetadata.schema.map(
              (col: any) => col.description,
            );
          return descriptions[params.node.rowIndex];
        },
        valueSetter: (params: any) => {
          try {
            const success = saveDescriptionForColumnInSchema(
              params.data.columnName,
              params.newValue,
            );
            return true;
          } catch (e) {
            console.error('Error saving description', e);
            return false;
          }
        },
      },
    ],
    [schema, saveDescriptionForColumnInSchema, selectedDataSourceOnDataView],
  );

  const containerStyle = useMemo(
    () => ({ width: '100%', agBorders: 'none' }),
    [],
  );
  const onGridReady = useCallback((params: any) => {
    params.api.sizeColumnsToFit();
  }, []);
  const rowStyle = { background: 'white' };
  const autoSizeStrategy = useMemo<
    | SizeColumnsToFitGridStrategy
    | SizeColumnsToFitProvidedWidthStrategy
    | SizeColumnsToContentStrategy
  >(() => {
    return {
      type: 'fitGridWidth',
    };
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={{ height: '100%', width: '100%' }}
        id="schema-preview-grid-container"
        className={
          'ag-theme-alpine flex flex-col h-full filesystem-table-container bg-[#eeeff1]'
        }
      >
        <AgGridReact
          rowData={schema}
          columnDefs={columns as any}
          rowSelection="multiple"
          onGridReady={(params) => onGridReady(params)}
          rowStyle={rowStyle}
          autoSizeStrategy={autoSizeStrategy}
          alwaysShowVerticalScroll={true}
          rowMultiSelectWithClick={false}
          rowHeight={38}
          gridOptions={{
            suppressRowHoverHighlight: true,
          }}
        />
      </div>
    </div>
  );
};

const getColumnIcon = (type: string) => {
  switch (type) {
    case 'string':
      return <FaFileCsv color="#4299E1" />;
    case 'datetime':
      return <FaCalendarAlt color="#9F7AEA" />;
    default:
      return <MdOutlineDataUsage color="#A0AEC0" />;
  }
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function TabsSelector({ tabs, setTabs }: { tabs: any; setTabs: any }) {
  return (
    <div className="my-2">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-[#eeeff1] focus:border-indigo-500 focus:ring-indigo-500"
          defaultValue={tabs.find((tab: any) => tab.current).name}
          onChange={(e) => {
            setTabs(
              tabs.map((tab: any) => {
                return {
                  ...tab,
                  current: tab.name === e.target.value,
                };
              }),
            );
          }}
        >
          {tabs.map((tab: any) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <nav className="flex space-x-4" aria-label="Tabs">
          {tabs.map((tab: any) => (
            <button
              key={tab.name}
              className={classNames(
                tab.current
                  ? 'bg-gray-100 text-gray-700'
                  : 'text-gray-500 hover:text-gray-700',
                'rounded-md px-3 py-2 text-sm font-medium',
              )}
              onClick={() => {
                setTabs(
                  tabs.map((t: any) => {
                    return {
                      ...t,
                      current: t.name === tab.name,
                    };
                  }),
                );
              }}
              aria-current={tab.current ? 'page' : undefined}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

export default DataViewModal;
