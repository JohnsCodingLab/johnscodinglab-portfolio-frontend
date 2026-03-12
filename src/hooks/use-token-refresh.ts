"use client";

import { useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3008/api";

/** Decode JWT payload without a library */
function decodeJwt(token: string): { exp?: number } | null {
    try {
        const base64 = token.split(".")[1];
        const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json);
    } catch {
        return null;
    }
}

/** Returns ms until token expires (negative = already expired) */
function msUntilExpiry(token: string): number {
    const payload = decodeJwt(token);
    if (!payload?.exp) return 0;
    return payload.exp * 1000 - Date.now();
}

export function useTokenRefresh() {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const refreshRef = useRef<(() => Promise<void>) | null>(null);
    const accessToken = useAuthStore((s) => s.accessToken);
    const setAuth = useAuthStore((s) => s.setAuth);
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const user = useAuthStore((s) => s.user);

    const scheduleRefresh = useCallback((token: string) => {
        if (timerRef.current) clearTimeout(timerRef.current);

        const ms = msUntilExpiry(token);
        const delay = Math.max(ms - 60_000, 0);

        timerRef.current = setTimeout(() => {
            refreshRef.current?.();
        }, delay);
    }, []);

    const refresh = useCallback(async () => {
        try {
            const { data } = await axios.post(
                `${API_BASE_URL}/auth/refresh`,
                {},
                { withCredentials: true },
            );

            const newToken = data.data?.accessToken || data.accessToken;
            if (!newToken || !user) return;

            setAuth(user, newToken);
            localStorage.setItem("accessToken", newToken);
            scheduleRefresh(newToken);
        } catch {
            clearAuth();
            localStorage.removeItem("accessToken");
            document.cookie =
                "has_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }, [user, setAuth, clearAuth, scheduleRefresh]);

    // Keep the ref in sync so the timer always calls the latest version
    useEffect(() => {
        refreshRef.current = refresh;
    }, [refresh]);

    useEffect(() => {
        if (!accessToken) return;

        const ms = msUntilExpiry(accessToken);

        if (ms <= 0) {
            refresh();
        } else {
            scheduleRefresh(accessToken);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [accessToken, refresh, scheduleRefresh]);
}
