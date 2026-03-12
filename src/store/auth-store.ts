import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
    user: User | null;
    accessToken: string | null;
    _hasHydrated: boolean;
    setAuth: (user: User, accessToken: string) => void;
    clearAuth: () => void;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            _hasHydrated: false,
            setAuth: (user, accessToken) => set({ user, accessToken }),
            clearAuth: () => set({ user: null, accessToken: null }),
            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: "jcl-auth",
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        },
    ),
);
