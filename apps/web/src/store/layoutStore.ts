import { create } from 'zustand';

interface LayoutState {
    sidebarCollapsed: boolean;
    sidebarOpen: boolean; // For mobile drawer
    notificationPanelOpen: boolean;
    searchModalOpen: boolean;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    setNotificationPanelOpen: (open: boolean) => void;
    setSearchModalOpen: (open: boolean) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
    sidebarCollapsed: false,
    sidebarOpen: false,
    notificationPanelOpen: false,
    searchModalOpen: false,
    toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    setNotificationPanelOpen: (open) => set({ notificationPanelOpen: open }),
    setSearchModalOpen: (open) => set({ searchModalOpen: open }),
}));
