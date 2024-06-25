import { Report } from '../reports/reportsStore';
import create from 'zustand';
import { ChartType } from 'chart.js';

type ViewMode = 'view' | 'collapse';

type QueriesState = {
  setItemBookmark: (
    conversationId: string,
    itemId: string,
    bookmarked: boolean,
  ) => void;
  selectedBookmarkMode: boolean;
  setSelectedBookmarkMode: (value: boolean) => void;
  bookmarkedQueryItems: QueryConversationItem[];
  setBookmarkedQueryItems: (items: QueryConversationItem[]) => void;
  currentCarouselItem: QueryConversationItem | null;
  setCurrentCarouselItem: (item: QueryConversationItem | null) => void;
  toggleCurrentCarouselItemBookmark: () => void;
  toggleItemBookmark: (conversationId: string, itemId: string) => void;
  llmModel: string;
  setLlmModel: (model: string) => void;

  threadsViewMode: ViewMode;
  setThreadsViewMode: (viewMode: ViewMode) => void;

  updateConversationItemChartType: (chartType: string) => void;
  updateConversationInHistory: (conversation: QueryConversation) => void;
  queryConversationHistory: QueryConversationHistory | null;
  setQueryConversationHistory: (conversations: QueryConversation[]) => void;
  addConversationToHistory: (conversation: QueryConversation) => void;
  currentQueryConversation: QueryConversation | null;
  setCurrentQueryConversation: (conversation: QueryConversation | null) => void;

  addItemToConversation: (
    conversationId: string,
    item: QueryConversationItem,
  ) => void;

  isDrawerOpen: boolean;
  setIsDrawerOpen: (value: boolean) => void;

  currentCarouselIndex: number;
  setCurrentCarouselIndex: (index: number) => void;

  deleteConversationFromHistory: (conversationId: string) => void;
  queriesTextAreaText: string;
  setQueriesTextAreaText: (text: string) => void;
};

export type QueryConversationHistory = {
  id: string;
  conversations: QueryConversation[];
};

export type QueryConversation = {
  id: string;
  conversationName: string;
  items: QueryConversationItem[];
  datasourceId?: string;
  createdAt?: string;
  unsaved?: boolean; // when clicked on `+ New` btn, we create a new conversation with this flag set to `true
};

export type QueryConversationItem = {
  id: string;
  query: string;
  answer: string;
  codeGenerated?: string;
  queryReport: Report;
  isGenerating?: boolean;
  bookmarked?: boolean;
};

export const useQueriesState = create<QueriesState>((set) => ({
  selectedBookmarkMode: false,
  setSelectedBookmarkMode: (value) => set({ selectedBookmarkMode: value }),
  queriesTextAreaText: '',
  setQueriesTextAreaText: (text) => set({ queriesTextAreaText: text }),
  bookmarkedQueryItems: [],
  setBookmarkedQueryItems: (items) => set({ bookmarkedQueryItems: items }),
  currentCarouselItem: null,
  setCurrentCarouselItem: (item) => set({ currentCarouselItem: item }),
  toggleCurrentCarouselItemBookmark: () =>
    set((state) => {
      if (state.currentCarouselItem) {
        return {
          currentCarouselItem: {
            ...state.currentCarouselItem,
            bookmarked: !state.currentCarouselItem.bookmarked,
          },
        };
      }
      return state;
    }),
  setItemBookmark: (
    conversationId: string,
    itemId: string,
    bookmarked: boolean,
  ) =>
    set((state) => {
      if (state.currentQueryConversation?.id === conversationId) {
        const updatedItems = state.currentQueryConversation.items.map(
          (item) => {
            if (item.id === itemId) {
              return {
                ...item,
                bookmarked: bookmarked,
              };
            }
            return item;
          },
        );

        const updatedConversation: QueryConversation = {
          ...state.currentQueryConversation,
          items: updatedItems,
        };

        if (state.queryConversationHistory) {
          const updatedConversations =
            state.queryConversationHistory.conversations.map((conversation) => {
              if (conversation.id === state.currentQueryConversation.id) {
                return updatedConversation;
              }
              return conversation;
            });

          return {
            currentQueryConversation: updatedConversation,
            queryConversationHistory: {
              ...state.queryConversationHistory,
              conversations: updatedConversations,
            },
          };
        }

        return {
          currentQueryConversation: updatedConversation,
        };
      }
      return state;
    }),
  toggleItemBookmark: (conversationId: string, itemId: string) =>
    set((state) => {
      if (
        state.currentQueryConversation
        // &&
        // state.currentQueryConversation.id === conversationId
      ) {
        console.log(
          'state.currentQueryConversation?.id',
          state.currentQueryConversation?.id,
        );
        console.log('conversationId', conversationId);

        const updatedItems = state.currentQueryConversation.items.map(
          (item) => {
            if (item.id === itemId) {
              return {
                ...item,
                bookmarked: !item.bookmarked,
              };
            }
            return item;
          },
        );

        const updatedConversation: QueryConversation = {
          ...state.currentQueryConversation,
          items: updatedItems,
        };

        if (state.queryConversationHistory) {
          const updatedConversations =
            state.queryConversationHistory.conversations.map((conversation) => {
              if (conversation.id === state.currentQueryConversation.id) {
                return updatedConversation;
              }
              return conversation;
            });

          return {
            currentQueryConversation: updatedConversation,
            queryConversationHistory: {
              ...state.queryConversationHistory,
              conversations: updatedConversations,
            },
          };
        } else {
          console.log('no history found');
        }

        return {
          currentQueryConversation: updatedConversation,
        };
      } else {
        console.log('no conversation found');
        console.log(
          'state.currentQueryConversation?.id',
          state.currentQueryConversation?.id,
        );
        console.log('conversationId', conversationId);
      }
      return state;
    }),
  threadsViewMode: 'view', // default collapse mode
  setThreadsViewMode: (viewMode) => set({ threadsViewMode: viewMode }),
  llmModel: 'gpt-3.5-turbo', // default value
  setLlmModel: (model) => set({ llmModel: model }),

  updateConversationItemChartType: (chartType: string) =>
    set((state) => {
      if (state.currentQueryConversation) {
        const updatedItems = state.currentQueryConversation.items.map(
          (item, index) => {
            if (index === state.currentCarouselIndex) {
              return {
                ...item,
                queryReport: {
                  ...item.queryReport,
                  chartInfo: {
                    ...item.queryReport.chartInfo,
                    type: chartType as any,
                  },
                },
              };
            }
            return item;
          },
        );

        return {
          currentQueryConversation: {
            ...state.currentQueryConversation,
            items: updatedItems,
          },
        };
      }
      return state;
    }),

  currentCarouselIndex: 0,
  setCurrentCarouselIndex: (index) => set({ currentCarouselIndex: index }),

  queryConversationHistory: null,
  setQueryConversationHistory: (conversations: QueryConversation[]) =>
    set((state) => {
      if (conversations) {
        return {
          queryConversationHistory: {
            id: state.queryConversationHistory?.id || 'history_id',
            conversations,
          },
        };
      } else {
        return { queryConversationHistory: null };
      }
    }),
  addConversationToHistory: (conversation) =>
    set((state) => {
      if (state.queryConversationHistory) {
        return {
          queryConversationHistory: {
            ...state.queryConversationHistory,
            conversations: [
              ...state.queryConversationHistory.conversations,
              conversation,
            ],
          },
        };
      } else {
        console.log('no history, returning here...');
        return {
          queryConversationHistory: {
            id: 'history_id',
            conversations: [conversation],
          },
        };
      }
    }),

  updateConversationInHistory: (conversation: QueryConversation) =>
    set((state) => {
      if (state.queryConversationHistory) {
        const updatedConversations =
          state.queryConversationHistory.conversations.map((conv) => {
            if (conv.id === conversation.id) {
              return conversation;
            }
            return conv;
          });

        return {
          queryConversationHistory: {
            ...state.queryConversationHistory,
            conversations: updatedConversations,
          },
        };
      }
      return state;
    }),

  addItemToConversation: (
    conversationId: string,
    item: QueryConversationItem,
  ) =>
    set((state) => {
      if (state.queryConversationHistory) {
        const updatedConversations =
          state.queryConversationHistory.conversations.map((conversation) => {
            if (conversation.id === conversationId) {
              return {
                ...conversation,
                items: [...conversation.items, item],
              };
            }
            return conversation;
          });

        return {
          queryConversationHistory: {
            ...state.queryConversationHistory,
            conversations: updatedConversations,
          },
        };
      }
      return state;
    }),

  currentQueryConversation: null,
  setCurrentQueryConversation: (conversation) =>
    set({ currentQueryConversation: conversation }),

  isDrawerOpen: true,
  setIsDrawerOpen: (value: boolean) => set({ isDrawerOpen: value }),

  deleteConversationFromHistory: (conversationId: string) =>
    set((state) => {
      if (state.queryConversationHistory) {
        const updatedConversations =
          state.queryConversationHistory.conversations.filter(
            (conversation) => conversation.id !== conversationId,
          );

        return {
          queryConversationHistory: {
            ...state.queryConversationHistory,
            conversations: updatedConversations,
          },
        };
      }
      return state;
    }),
}));

export const checkIfConversationExists = (conversationId: string): boolean => {
  const state = useQueriesState.getState();
  if (!state.queryConversationHistory) {
    return false;
  }
  return state.queryConversationHistory.conversations.some(
    (conversation) => conversation.id === conversationId,
  );
};
