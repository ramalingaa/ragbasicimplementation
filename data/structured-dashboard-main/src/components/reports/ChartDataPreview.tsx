import React, { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FaChevronDown, FaChevronUp, FaDownload } from 'react-icons/fa';
import { Column } from 'ag-grid-community';

interface ChartDataPreviewProps {
  chartInfo: any;
  reportDataSource: any;
  queryAnswer?: string;
}
interface RowData {
  [key: string]: string | number | null;
}

const ChartDataPreview: React.FC<ChartDataPreviewProps> = ({
  chartInfo,
  reportDataSource,
  queryAnswer,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const columns = useMemo(() => {
    try {
      const commonHeaders = chartInfo.options?.series?.map((seriesVal: any, index: any) => ({
        headerName: seriesVal?.name || `Value Descriptor`,
        field: `value${index}`,
        minWidth: 100,
        flex: index === (chartInfo.options?.series?.length ?? 0) - 1 ? 1 : undefined,
        resizable: false,
      })) || [];

      const pieChartHeaders = [
        {
          headerName: 'Value',
          field: 'value',
          minWidth: 100,
          flex: 1,
          resizable: false,
        },
      ];

      let finalHeaders = chartInfo.type === 'pie' ? pieChartHeaders : commonHeaders;
      return [
        {
          headerName: 'Label',
          field: 'label',
          minWidth: 150,
          resizable: false,
        },
        ...finalHeaders,
      ];
    } catch (error) {
      console.error("Error computing columns:", error);
      return [];
    }
  }, [chartInfo]);

  const rowData = useMemo(() => {
    try {
      if (chartInfo.type !== 'pie' && chartInfo.options?.xAxis?.data) {
        return chartInfo.options.xAxis.data.map((label: any, labelIndex: any) => {
          const row: any = { label };
          chartInfo.options.series.forEach((series: any, seriesIndex: any) => {
            row[`value${seriesIndex}`] = series.data[labelIndex] ?? null;
          });
          return row;
        });
      } else if (chartInfo.type === 'pie' && chartInfo.options?.series?.length > 0) {
        return chartInfo.options.series[0].data.map((dataPoint: any) => ({
          label: dataPoint.name,
          value: dataPoint.value.toString(),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error computing rowData:", error);
      return [];
    }
  }, [chartInfo]);

  const containerStyle = useMemo(
    () => ({
      width: '100%',
      height: '16rem',
      bg: 'red',
      overflow: 'hidden',
      transition: 'height 0.3s ease-in-out, padding 0.3s ease-in-out',
    }),
    [isOpen],
  );

  const toggleAccordion = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const downloadTable = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    const params = {
      fileName: 'table.csv',
      columnKeys: columns.map((column: any) => column?.field),
    };
    gridRef.current?.api.exportDataAsCsv(params);
  };

  const gridRef = React.useRef<AgGridReact>(null);

  return (
    <div className="rounded-md mt-4 p-4 border-[1px] border-[#eeeff1]">
      <div className='flex flex-row justify-between'>
        <span className="font-bold text-md">
          {JSON.stringify(queryAnswer).replace(
            /^"|"$/g,
            '',
          )}
        </span>
        <button
          onClick={downloadTable}
          className="max-w-fit inline-flex w-full items-center text-gray-500 justify-center gap-x-1.5 rounded-md px-2 py-1 text-xs font-semibold shadow-sm hover:bg-gray-500 hover:text-white border border-gray-500 h-8 mr-4 ease-in-out transition-all duration-150"
        >
          <FaDownload />
        </button>
      </div>
      <div className='flex flex-col gap-y-2 mt-2'>
        <div style={containerStyle}>
          <div
            style={{ height: '100%', width: '100%' }}
            className="ag-theme-alpine"
          >
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columns as any}
              defaultColDef={{
                resizable: true,
                sortable: true,
                filter: true,
              }}
              rowStyle={{ fontSize: '12px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartDataPreview;
