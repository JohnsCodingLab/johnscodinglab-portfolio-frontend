"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";

const SOCKET_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
    "http://localhost:3008";

export interface Notification {
    id: string;
    name: string;
    subject: string;
    email: string;
    createdAt: Date;
    dismissed: boolean;
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            withCredentials: true,
            transports: ["websocket", "polling"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("[WS] Connected:", socket.id);
        });

        socket.on("newMessage", (data: Omit<Notification, "dismissed">) => {
            setNotifications((prev) => [
                { ...data, dismissed: false },
                ...prev,
            ]);

            // Auto-refresh contacts list
            queryClient.invalidateQueries({ queryKey: ["contacts"] });
        });

        socket.on("disconnect", () => {
            console.log("[WS] Disconnected");
        });

        return () => {
            socket.disconnect();
        };
    }, [queryClient]);

    const dismiss = useCallback((id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, dismissed: true } : n)),
        );
    }, []);

    const dismissAll = useCallback(() => {
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, dismissed: true })),
        );
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = notifications.filter((n) => !n.dismissed).length;

    return { notifications, unreadCount, dismiss, dismissAll, clearAll };
}
