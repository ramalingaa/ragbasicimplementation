'use client';

// BlockDetailsContainer.tsx
import React, { useRef, useEffect } from 'react';
import { Block, useBlocksStore } from '../../zustand/blocks/blocksStore';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const BlockDetailsContainer: React.FC = () => {
  const block: Block | null = useBlocksStore((state) => state.selectedBlock);
  const setSelectedBlock = useBlocksStore((state) => state.setSelectedBlock);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSelectedBlock(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setSelectedBlock]);

  if (!block) {
    return null;
  }

  let columnNames = [];
  let columnDefs: any[];

  if (block.blockResults) {
    columnNames =
      block.blockResults.length > 0 ? Object.keys(block.blockResults[0]) : [];

    columnDefs = columnNames.map((columnName, index) => ({
      headerName: columnName.replace(/\_/g, ' '),
      field: columnName,
      cellStyle:
        index === columnNames.length - 1
          ? {
              backgroundColor: '#DBEAFE',
              color: '#1E40AF',
              fontWeight: 'bold',
            }
          : {},
    }));
  }

  return (
    <div
      ref={containerRef}
      className="w-4/5 mx-auto border border-gray-300 rounded-lg p-4 mt-8"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{block.blockName}</h2>
      </div>
      <div className="flex items-center mb-2">
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          Automations
        </span>
      </div>
      <p className="text-gray-600">
        • Follow-ups or interventions for accounts that may be at risk of
        churning
      </p>
      <div className="flex items-center mb-2 mt-4">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
          Results
        </span>
      </div>
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={block.blockResults}
          columnDefs={columnDefs}
          defaultColDef={{
            flex: 1,
            minWidth: 150,
            resizable: true,
          }}
        />
      </div>
    </div>
  );
};

export default BlockDetailsContainer;
