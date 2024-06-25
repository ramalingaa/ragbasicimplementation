
import React from 'react';

import { DataSource } from '../../interfaces/DataTypes';

interface DataSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  setChosenDataSource: (dataSource: DataSource) => void;
  chosenDataSource: DataSource | null;
  inBlocks?: boolean;
  inQueries?: boolean;
  csvOnly?: boolean;
}

const DataSourceModal: React.FC<DataSourceModalProps> = ({
  isOpen,
  onClose,
  setChosenDataSource,
  chosenDataSource,
  inBlocks,
  inQueries,
  csvOnly,
}) => {
  return (
    <></>
  );
};

export default DataSourceModal;
