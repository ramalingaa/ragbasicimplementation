import { DataSource } from '../../interfaces/DataTypes';
import FileSystemTable from './FileSystemTable';
import useCsvConnection from 'hooks/harbor/useCsvConnection';
import useFetchDataSources from 'hooks/harbor/useFetchDataSources';
import { useHarborStore } from '../../zustand/harbor/harborStore';
import { useState } from 'react';
import EmptyState from 'components/emptyState/EmptyState';

export default function ConnectedDataSources() {
  const dataSources = useHarborStore((state) => state.dataSources);

  const [selectedDataSource, setSelectedDataSource] =
    useState<DataSource | null>(null);

  const [openedDataSourcePreview, setOpenedDataSourcePreview] = useState<
    string | null
  >(null);

  const { errorMessage, isLoading } = useFetchDataSources();
  const {
    isUploading: deletingCsvConnectionLoading,
    deletingCsvConnectionId,
    deleteCsvConnection,
  } = useCsvConnection();

  const initiateDeleteCsvConnection = (selectedDataSource: any) => {
    deleteCsvConnection(selectedDataSource.id, selectedDataSource.name);
  };

  const toggleDataSource = (source: DataSource) => {
    if (openedDataSourcePreview === source.id) {
      setOpenedDataSourcePreview(null);
    } else {
      setOpenedDataSourcePreview(source.id);
    }
  };
  const { sourcesTableAndGraphViewSideBySide } = useHarborStore();

  return (
    <div
      className={`flex flex-col overflow-y-auto overflow-x-auto w-full border-r-[1px] border-[#eeeff1]`}
      style={{
        height: isLoading ? 'calc(100vh - 6rem)' : '100%',
      }}
    >
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
        // <div className={`h-full ${sourcesTableAndGraphViewSideBySide ? 'overflow-y-scroll' : ''}`}
        //   style={{ height: sourcesTableAndGraphViewSideBySide ? 'calc(100vh - 6rem)' : '100%' }}
        // >
        <div className={`${dataSources.length == 0 && 'items-center'}`}
          style={{
            height: dataSources.length == 0 ? 'calc(100vh - 6rem)' : '100%',
          }}
        >
          {dataSources.length === 0 ? (
            <EmptyState
              title='No Data Sources'
              desciption='Get started by connecting a new data source.'
            // btnText='New Data Source'
            />
          ) : (
            <FileSystemTable dataSources={dataSources} />
          )}
        </div>
      )}
    </div>
  );
}


