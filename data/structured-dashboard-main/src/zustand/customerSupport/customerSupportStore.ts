import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CustomerSupportState {
    chatVisible: boolean,
    setChatVisible: (chatVisible: boolean) => void,
};

export const CustomerSupportStore = create<CustomerSupportState>(
    (set) => ({
        chatVisible: false,
        setChatVisible: (chatVisible: boolean) => set({ chatVisible }),
    }),
)

// export const useWorkspaceStore = useStore(workspaceStore,  (state) => state);
export const useCustomerSupportStore = CustomerSupportStore;
