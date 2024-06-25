import create from 'zustand';

type NotificationStore = {
    isShowNotification: boolean;
    showNotification: (isOpen: boolean) => void;
    notificationMessage: string;
    setNotificationMessage: (message: string) => void;
    status: 'success' | 'failure' | '';
    setStatus: (status: 'success' | 'failure' | '') => void;
    setNotificationState: (isOpen: boolean, message: string, status: 'success' | 'failure' | '') => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
    isShowNotification: false,
    showNotification: (isOpen: boolean) => set({ isShowNotification: isOpen }),
    notificationMessage: 'Datasource saved successfully.',
    setNotificationMessage: (message: string) => set({ notificationMessage: message }),
    status: 'success',
    setStatus: (status: 'success' | 'failure' | '') => set({ status: status }),
    setNotificationState: (isOpen: boolean, message: string, status: 'success' | 'failure' | '') => set({ isShowNotification: isOpen, notificationMessage: message, status: status}),
}));
