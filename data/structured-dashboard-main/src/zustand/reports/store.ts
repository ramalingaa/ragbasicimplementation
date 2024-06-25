import create from 'zustand';
import { DataSource } from '../../interfaces/DataTypes';

type LogItem = {
  logSearchQuery: string;
  logSearchResponse: string;
};

type LogConversation = {
  id: string;
  conversationTitle: string;
  timeStamp?: string;
  items: LogItem[];
  isLogConversationOpen?: boolean;
};

type DashboardState = {
  showIntegrationsOptions: boolean;
  setShowIntegrationsOptions: (value: boolean) => void;
  dataSources: DataSource[];
  setDataSources: (dataSources: DataSource[]) => void;

  chosenDataSource: DataSource | null;
  setChosenDataSource: (dataSource: DataSource | null) => void;

  keywords: string[];
  addKeyword: (keyword: string) => void;
  removeKeyword: (keyword: string) => void;

  logSearchRecords: string[];
  setLogSearchRecords: (logSearchRecords: string[]) => void;

  logSearchResponse: string;
  setLogSearchResponse: (value: string) => void;

  logSearchQuery: string;
  setLogSearchQuery: (value: string) => void;

  sessionHistory: LogConversation[];
  addToSessionHistory: (conversation: LogConversation) => void;
  clearSessionHistory: () => void;
  updateSessionHistory: (conversation: LogConversation) => void;

  showBanner: boolean;
  setShowBanner: (value: boolean) => void;

  userConnectedGithubRepos: any[];
  setUserConnectedGithubRepos: (repos: any[]) => void;

  autoApiBuilderResponse: string;
  setAutoApiBuilderResponse: (value: string) => void;

  turboModeOn: boolean;
  setTurboModeOn: (value: boolean) => void;

  showSources: boolean;
  setShowSources: (value: boolean) => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  showIntegrationsOptions: false,
  setShowIntegrationsOptions: (value) =>
    set({ showIntegrationsOptions: value }),
  dataSources: [],
  setDataSources: (dataSources) => set({ dataSources }),

  chosenDataSource: null,
  setChosenDataSource: (dataSource) => set({ chosenDataSource: dataSource }),

  keywords: [],
  addKeyword: (keyword) =>
    set((state) => ({ keywords: [...state.keywords, keyword] })),
  removeKeyword: (keyword) =>
    set((state) => ({ keywords: state.keywords.filter((k) => k !== keyword) })),

  logSearchRecords: [],
  setLogSearchRecords: (records) => set({ logSearchRecords: records }),

  logSearchResponse: '',
  setLogSearchResponse: (value) => set({ logSearchResponse: value }),

  logSearchQuery: '',
  setLogSearchQuery: (value) => set({ logSearchQuery: value }),

  sessionHistory: [],
  addToSessionHistory: (conversation) =>
    set((state) => ({
      sessionHistory: [...state.sessionHistory, conversation],
    })),
  clearSessionHistory: () => set({ sessionHistory: [] }),
  updateSessionHistory: (updatedConversation) =>
    set((state) => ({
      sessionHistory: state.sessionHistory.map((conversation) =>
        conversation.id === updatedConversation.id
          ? updatedConversation
          : conversation,
      ),
    })),

  showBanner: true,
  setShowBanner: (value) => set({ showBanner: value }),

  userConnectedGithubRepos: [],
  setUserConnectedGithubRepos: (repos) =>
    set({ userConnectedGithubRepos: repos }),

  autoApiBuilderResponse: '',
  setAutoApiBuilderResponse: (value) => set({ autoApiBuilderResponse: value }),

  turboModeOn: true,
  setTurboModeOn: (value) => set({ turboModeOn: value }),

  showSources: false,
  setShowSources: (value) => set({ showSources: value }),
}));
