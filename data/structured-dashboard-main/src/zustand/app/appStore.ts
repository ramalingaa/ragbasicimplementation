import create from 'zustand';

type SidebarState = {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
  mobileScreenSidebarOpen: boolean;
  setMobileScreenSidebarOpen: (isOpen: boolean) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isSidebarOpen: true,
  setSidebarOpen: (isOpen: boolean) => set({ isSidebarOpen: isOpen }),
  mobileScreenSidebarOpen: false,
  setMobileScreenSidebarOpen: (isOpen: boolean) => set({ mobileScreenSidebarOpen: isOpen }),
}));
