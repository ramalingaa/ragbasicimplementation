import { DataSource } from '../../interfaces/DataTypes';
import create from 'zustand';

type ViewMode = 'list' | 'graph';

export type ComponentView = 'source' | 'unit' | 'type';

type HarborState = {
  dataSources: DataSource[];
  setDataSources: (dataSources: DataSource[]) => void;
  selectedDataSources: DataSource[];
  setSelectedDataSources: (dataSources: DataSource[]) => void;

  reportsChosenDataSource: DataSource | null;
  setReportsChosenDataSource: (dataSource: DataSource | null) => void;
  queriesChosenDataSource: DataSource | null;
  setQueriesChosenDataSource: (dataSource: DataSource | null) => void;
  harborViewMode: ViewMode;
  setHarborViewMode: (viewMode: ViewMode) => void;

  // Data view modal
  selectedDataSourceOnDataView: DataSource | null;
  setSelectedDataSourceOnDataView: (dataSource: DataSource | null) => void;
  isDataViewModalOpen: boolean;
  onCloseDataViewModal: () => void;
  onOpenDataViewModal: () => void;

  originalSources: DataSource[];
  setOriginalSources: (dataSources: DataSource[]) => void;
  joinedSources: DataSource[];
  setJoinedSources: (dataSources: DataSource[]) => void;

  componentView: ComponentView;
  setComponentView: (componentView: ComponentView) => void;

  sourcesTableAndGraphViewSideBySide: boolean;
  setSourcesTableAndGraphViewSideBySide: (value: boolean) => void;

  typesTableAndGraphViewSideBySide: boolean;
  setTypesTableAndGraphViewSideBySide: (value: boolean) => void;

  entityTypes: DataSource[];
  setEntityTypes: (entityTypes: DataSource[]) => void;

  isGeneratePsqlUnitsOpen: boolean;
  onCloseGeneratePsqlUnitsModal: () => void;
  onOpenGeneratePsqlUnitsModal: () => void;
};

export const useHarborStore = create<HarborState>((set) => ({
  dataSources: [],
  setDataSources: (dataSources) => set({ dataSources }),
  selectedDataSources: [],
  setSelectedDataSources: (dataSources) => set({ selectedDataSources: dataSources }),
  reportsChosenDataSource: null,
  setReportsChosenDataSource: (dataSource) =>
    set({ reportsChosenDataSource: dataSource }),
  queriesChosenDataSource: null,
  setQueriesChosenDataSource: (dataSource) =>
    set({ queriesChosenDataSource: dataSource }),
  harborViewMode: 'list',
  setHarborViewMode: (viewMode) => set({ harborViewMode: viewMode }),
  selectedDataSourceOnDataView: null,
  setSelectedDataSourceOnDataView: (dataSource) =>
    set({ selectedDataSourceOnDataView: dataSource }),
  isDataViewModalOpen: false,
  onCloseDataViewModal: () => set({ isDataViewModalOpen: false }),
  onOpenDataViewModal: () => set({ isDataViewModalOpen: true }),
  originalSources: [],
  setOriginalSources: (dataSources) => set({ originalSources: dataSources }),
  joinedSources: [],
  setJoinedSources: (dataSources) => set({ joinedSources: dataSources }),

  componentView: 'source' as ComponentView,
  setComponentView: (componentView) => set({ componentView }),

  sourcesTableAndGraphViewSideBySide: false,
  setSourcesTableAndGraphViewSideBySide: (value) =>
    set({ sourcesTableAndGraphViewSideBySide: value }),

  typesTableAndGraphViewSideBySide: false,
  setTypesTableAndGraphViewSideBySide: (value) =>
    set({ typesTableAndGraphViewSideBySide: value }),

  entityTypes: [],
  setEntityTypes: (entityTypes) => set({ entityTypes }),

  isGeneratePsqlUnitsOpen: false,
  onCloseGeneratePsqlUnitsModal: () => set({ isGeneratePsqlUnitsOpen: false }),
  onOpenGeneratePsqlUnitsModal: () => set({ isGeneratePsqlUnitsOpen: true }),

}));
