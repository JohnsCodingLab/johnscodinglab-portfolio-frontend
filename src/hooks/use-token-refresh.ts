"use client";

import { useEffect, useRef } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://portfolio-api-pm4w.onrender.com/api";

function decodeJwt(token: string): { exp?: number } | null {
    try {
        const base64 = token.split(".")[1];
        const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json);
    } catch {
        return null;
    }
}

function msUntilExpiry(token: string): number {
    const payload = decodeJwt(token);
    if (!payload?.exp) return 0;
    return payload.exp * 1000 - Date.now();
}

export function useTokenRefresh() {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const doRefresh = async () => {
            const { accessToken, user, setAuth, clearAuth } =
                useAuthStore.getState();
            if (!accessToken || !user) return;

            try {
                const { data } = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true },
                );

                const newToken = data.data?.accessToken || data.accessToken;
                if (!newToken) return;

                setAuth(user, newToken);
                localStorage.setItem("accessToken", newToken);
                schedule(newToken);
            } catch (err: unknown) {
                const status = axios.isAxiosError(err)
                    ? err.response?.status
                    : null;
                // Only log out on definitive auth failures, not network errors
                if (status === 401 || status === 403) {
                    clearAuth();
                    localStorage.removeItem("accessToken");
                    document.cookie =
                        "has_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    window.location.href = "/login";
                } else {
                    // Network error — retry in 30 seconds
                    timerRef.current = setTimeout(doRefresh, 30_000);
                }
            }
        };

        const schedule = (token: string) => {
            if (timerRef.current) clearTimeout(timerRef.current);
            const ms = msUntilExpiry(token);
            // Refresh 90 seconds before expiry (gives more buffer)
            const delay = Math.max(ms - 90_000, 0);
            timerRef.current = setTimeout(doRefresh, delay);
        };

        const { accessToken } = useAuthStore.getState();
        if (!accessToken) return;

        const ms = msUntilExpiry(accessToken);
        if (ms <= 30_000) {
            // Already expired or expiring very soon — refresh immediately
            doRefresh();
        } else {
            schedule(accessToken);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount — reads store state directly to avoid dep issues
}
