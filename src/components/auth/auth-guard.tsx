"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

/**
 * Wraps dashboard pages — redirects to /login if no user.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const hasHydrated = useAuthStore((s) => s._hasHydrated);

    useEffect(() => {
        if (hasHydrated && !user) {
            router.replace("/login");
        }
    }, [user, hasHydrated, router]);

    // Wait for hydration, then check user
    if (!hasHydrated || !user) return null;

    return <>{children}</>;
}

/**
 * Wraps /login — redirects to / if already logged in.
 */
export function GuestGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const hasHydrated = useAuthStore((s) => s._hasHydrated);

    useEffect(() => {
        if (hasHydrated && user) {
            router.replace("/");
        }
    }, [user, hasHydrated, router]);

    if (!hasHydrated || user) return null;

    return <>{children}</>;
}
