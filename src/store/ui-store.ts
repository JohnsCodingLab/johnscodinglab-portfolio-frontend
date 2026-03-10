import { create } from "zustand";

interface UIState {
    unreadContactCount: number;
    isMobileSidebarOpen: boolean;

    setUnreadContactCount: (count: number) => void;
    incrementUnreadCount: () => void;
    toggleMobileSidebar: () => void;
    closeMobileSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    unreadContactCount: 0,
    isMobileSidebarOpen: false,

    setUnreadContactCount: (count) => set({ unreadContactCount: count }),
    incrementUnreadCount: () =>
        set((state) => ({ unreadContactCount: state.unreadContactCount + 1 })),
    toggleMobileSidebar: () =>
        set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen })),
    closeMobileSidebar: () => set({ isMobileSidebarOpen: false }),
}));
