import React from 'react';


import { DataSource } from '../../../interfaces/DataTypes';
import { useDashboardStore } from '../../../zustand/reports/store';

interface ModalBodyContentProps {
    isLoading: boolean;
    errorMessage: string | null;
    dataSources: DataSource[];
    chosenDataSource: DataSource | null;
    themeItemColor: string;
    initiateGetUserBucketFiles: (source: DataSource) => void;
    setChosenDataSource: (source: DataSource) => void;
    userBucketContentsLoading: boolean;
    onClose: () => void;
    inBlocks?: boolean;
    inQueries?: boolean;
    csvOnly?: boolean;
}

const ModalBodyContent: React.FC<ModalBodyContentProps> = ({
    isLoading,
    errorMessage,
    dataSources,
    chosenDataSource,
    themeItemColor,
    initiateGetUserBucketFiles,
    setChosenDataSource,
    userBucketContentsLoading,
    onClose,
    inBlocks,
    inQueries,
    csvOnly,
}) => {
    const setDataSources = useDashboardStore((state) => state.setDataSources);

    return (
        <>

        </>
    );
};

export default ModalBodyContent;
