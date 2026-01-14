import { create } from 'zustand';

interface LayoutState {
    drawerOpen: boolean;
    notificationBadgeCount: number;
    activeTab: string;
    setDrawerOpen: (open: boolean) => void;
    setNotificationBadgeCount: (count: number) => void;
    setActiveTab: (tab: string) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
    drawerOpen: false,
    notificationBadgeCount: 0,
    activeTab: 'Home',
    setDrawerOpen: (open) => set({ drawerOpen: open }),
    setNotificationBadgeCount: (count) => set({ notificationBadgeCount: count }),
    setActiveTab: (tab) => set({ activeTab: tab }),
}));
