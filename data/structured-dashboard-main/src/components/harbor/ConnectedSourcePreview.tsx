import React, { useEffect, useState } from 'react';

import { DataSource } from '../../interfaces/DataTypes';
import useFetchDataSources from 'hooks/harbor/useFetchDataSources';
import { DATASOURCES_DIR, ENTITY_TYPE_FILES_DIR } from 'utils/constants';

interface ConnectedSourcePreviewProps {
  source: DataSource | null;
  setSelectedDataSourceOnDataView: (source: DataSource) => void;
  s3Dir?: string;
}

const ConnectedSourcePreview: React.FC<ConnectedSourcePreviewProps> = ({
  source,
  setSelectedDataSourceOnDataView,
  s3Dir=DATASOURCES_DIR,
}) => {
  const { isLoading: getFileContentsIsLoading, getFileContents, errorMessage:error } = useFetchDataSources();
  const [decodedContents, setDecodedContents] = useState<any>(
    source && source.decodedContents ? source.decodedContents : null,
  );

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    const retryInterval = 1000; // 1 second

    async function init() {
      if (source && !source.decodedContents) {
        const decodedContentsLocal = await getFileContents(source, s3Dir);
        console.log({ decodedContentsLocal });
        if (decodedContentsLocal != null && decodedContentsLocal != undefined && decodedContentsLocal?.length > 0) {
          setDecodedContents(decodedContentsLocal);
          setSelectedDataSourceOnDataView({ ...source, decodedContents: decodedContentsLocal });
        } else {
          // Retry fetching file contents
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(init, retryInterval);
          } else {
            console.error('Max retries exceeded. Failed to fetch file contents.');
          }
        }
      }
    }

    init();
  }, [source]);


  return (
    <div className="w-full overflow-x-auto overflow-y-scroll rounded-md">
      {!getFileContentsIsLoading && decodedContents ? (
        <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                {Object.keys(decodedContents[0] || {}).map((key, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {decodedContents.map((row: any, rowIndex: number) => (
                <tr key={rowIndex} className='max-h-full'>
                  {Object.keys(row).map((key, valueIndex) => (
                    <td
                      key={valueIndex}
                      className="px-4 py-2 whitespace-no-wrap text-sm leading-5 text-gray-500 max-h-10 h-10 overflow-hidden truncate"
                    >
                      {typeof row[key] === 'string' || typeof row[key] === 'number'
                        ? row[key]
                        : null}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-sm leading-5 font-medium text-gray-900">
          {error ? (
            <p className="text-gray-500">Error: {error}</p>
          ) : getFileContentsIsLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <p className="text-gray-500">No Decoded contents...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectedSourcePreview;
