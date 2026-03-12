"use client";

import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, Terminal, Clock, Bell, X, Mail } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNotifications } from "@/hooks/use-notifications";

const accent = "#00ff88";
const dim = "#555577";
const subtle = "rgba(80,80,120,0.35)";
const cyan = "#00c8ff";

function LiveClock() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(
                now.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                }),
            );
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-[11px] font-mono"
            style={{
                borderColor: subtle,
                background: "rgba(255,255,255,0.02)",
                color: dim,
            }}
        >
            <Clock
                className="h-3 w-3"
                style={{ color: "rgba(0,255,136,0.4)" }}
            />
            <span style={{ color: "#8888aa", letterSpacing: "0.05em" }}>
                {time}
            </span>
        </div>
    );
}

function getInitials(name: string) {
    return (
        name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase() || "AD"
    );
}

/* ─── notification dropdown ─── */
function NotificationBell() {
    const { notifications, unreadCount, dismiss, dismissAll, clearAll } =
        useNotifications();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="relative p-1.5 rounded-sm border transition-all duration-150"
                style={{
                    borderColor:
                        unreadCount > 0 ? "rgba(0,200,255,0.3)" : subtle,
                    color: unreadCount > 0 ? cyan : dim,
                    background:
                        unreadCount > 0
                            ? "rgba(0,200,255,0.05)"
                            : "transparent",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(0,200,255,0.4)";
                    (e.currentTarget as HTMLElement).style.color = cyan;
                    (e.currentTarget as HTMLElement).style.background =
                        "rgba(0,200,255,0.05)";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                        unreadCount > 0 ? "rgba(0,200,255,0.3)" : subtle;
                    (e.currentTarget as HTMLElement).style.color =
                        unreadCount > 0 ? cyan : dim;
                    (e.currentTarget as HTMLElement).style.background =
                        unreadCount > 0
                            ? "rgba(0,200,255,0.05)"
                            : "transparent";
                }}
            >
                <Bell className="h-3.5 w-3.5" />
                {unreadCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-mono font-bold rounded-full"
                        style={{
                            background: cyan,
                            color: "#080810",
                            boxShadow: `0 0 8px ${cyan}`,
                        }}
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* dropdown */}
            {open && (
                <div
                    className="absolute right-0 top-full mt-2 w-80 rounded-sm border overflow-hidden z-50 bg-popover"
                    style={{
                        borderColor: "rgba(0,200,255,0.2)",
                        boxShadow:
                            "0 0 40px rgba(0,0,0,0.5), 0 0 20px rgba(0,200,255,0.04)",
                    }}
                >
                    {/* header */}
                    <div
                        className="flex items-center justify-between px-4 py-2.5 border-b"
                        style={{
                            borderColor: "rgba(80,80,120,0.3)",
                            background: "rgba(255,255,255,0.02)",
                        }}
                    >
                        <span
                            className="text-[10px] font-mono tracking-widest uppercase font-bold"
                            style={{ color: cyan }}
                        >
                            Notifications
                            {unreadCount > 0 && (
                                <span
                                    className="ml-2 px-1.5 py-0.5 rounded-sm"
                                    style={{
                                        background: "rgba(0,200,255,0.1)",
                                        border: "1px solid rgba(0,200,255,0.25)",
                                    }}
                                >
                                    {unreadCount}
                                </span>
                            )}
                        </span>
                        <div className="flex gap-1">
                            {notifications.length > 0 && (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dismissAll();
                                        }}
                                        className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-sm border transition-all hover:bg-white/5"
                                        style={{
                                            borderColor: subtle,
                                            color: dim,
                                        }}
                                    >
                                        Read All
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            clearAll();
                                        }}
                                        className="text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-sm border transition-all hover:bg-white/5"
                                        style={{
                                            borderColor: subtle,
                                            color: dim,
                                        }}
                                    >
                                        Clear
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* items */}
                    <div
                        className="max-h-64 overflow-y-auto"
                        style={{ scrollbarWidth: "thin" }}
                    >
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center">
                                <Bell
                                    className="h-6 w-6 mx-auto mb-2"
                                    style={{ color: "rgba(80,80,120,0.2)" }}
                                />
                                <p
                                    className="text-[11px] font-mono"
                                    style={{ color: dim }}
                                >
                                    No notifications
                                </p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className="flex items-start gap-3 px-4 py-3 border-b transition-all hover:bg-[rgba(0,200,255,0.02)]"
                                    style={{
                                        borderColor: "rgba(80,80,120,0.15)",
                                        opacity: n.dismissed ? 0.5 : 1,
                                    }}
                                >
                                    <div className="shrink-0 mt-0.5">
                                        {!n.dismissed ? (
                                            <div
                                                className="w-2 h-2 rounded-full mt-1"
                                                style={{
                                                    background: cyan,
                                                    boxShadow: `0 0 6px ${cyan}`,
                                                }}
                                            />
                                        ) : (
                                            <Mail
                                                className="h-3 w-3 mt-0.5"
                                                style={{
                                                    color: "rgba(80,80,120,0.3)",
                                                }}
                                            />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className="text-[11px] font-mono font-bold truncate"
                                            style={{
                                                color: n.dismissed
                                                    ? "#666688"
                                                    : "#e0e0ff",
                                            }}
                                        >
                                            {n.name}
                                        </p>
                                        <p
                                            className="text-[10px] font-mono truncate"
                                            style={{ color: dim }}
                                        >
                                            {n.subject}
                                        </p>
                                        <p
                                            className="text-[9px] font-mono mt-0.5"
                                            style={{
                                                color: "rgba(80,80,120,0.5)",
                                            }}
                                        >
                                            {new Date(
                                                n.createdAt,
                                            ).toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    {!n.dismissed && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dismiss(n.id);
                                            }}
                                            className="shrink-0 p-1 rounded-sm transition-all hover:bg-white/5"
                                        >
                                            <X
                                                className="h-3 w-3"
                                                style={{ color: dim }}
                                            />
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export function Header() {
    const user = useAuthStore((state) => state.user);
    const { toggleMobileSidebar } = useUIStore();
    const { theme, setTheme } = useTheme();

    const initials = getInitials(user?.name || "Admin");

    return (
        <header
            className="relative flex items-center h-14 px-4 top-0 z-50 border-b bg-background/90"
            style={{
                borderColor: subtle,
                backdropFilter: "blur(12px)",
            }}
        >
            {/* scanline */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.015]"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)",
                }}
            />

            {/* bottom accent line */}
            <div
                className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
                style={{
                    background: `linear-gradient(to right, transparent, rgba(0,255,136,0.15) 30%, rgba(0,255,136,0.08) 70%, transparent)`,
                }}
            />

            {/* ── LEFT: mobile menu ── */}
            <button
                className="md:hidden mr-3 p-1.5 rounded-sm border transition-all"
                style={{ borderColor: subtle, color: dim }}
                onClick={toggleMobileSidebar}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                        "rgba(0,255,136,0.3)";
                    (e.currentTarget as HTMLElement).style.color = accent;
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = subtle;
                    (e.currentTarget as HTMLElement).style.color = dim;
                }}
            >
                <Menu className="h-4 w-4" />
            </button>

            {/* ── LEFT: breadcrumb path ── */}
            <div
                className="hidden md:flex items-center gap-1.5 text-[11px] font-mono"
                style={{ color: dim }}
            >
                <Terminal
                    className="h-3 w-3"
                    style={{ color: "rgba(0,255,136,0.5)" }}
                />
                <span style={{ color: "rgba(80,80,120,0.6)" }}>~/</span>
                <span style={{ color: "#8888aa" }}>admin</span>
                <span style={{ color: "rgba(0,255,136,0.3)" }}>/</span>
                <span style={{ color: accent }}>dashboard</span>
                <span className="ml-2 animate-pulse" style={{ color: accent }}>
                    ▌
                </span>
            </div>

            {/* ── RIGHT ── */}
            <div className="ml-auto flex items-center gap-2">
                {/* live clock */}
                <LiveClock />

                {/* divider */}
                <div
                    className="hidden md:block w-px h-5 mx-1"
                    style={{ background: subtle }}
                />

                {/* notification bell */}
                <NotificationBell />

                {/* theme toggle */}
                <button
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="relative p-1.5 rounded-sm border transition-all duration-150"
                    style={{ borderColor: subtle, color: dim }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                            "rgba(0,255,136,0.3)";
                        (e.currentTarget as HTMLElement).style.color = accent;
                        (e.currentTarget as HTMLElement).style.background =
                            "rgba(0,255,136,0.05)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                            subtle;
                        (e.currentTarget as HTMLElement).style.color = dim;
                        (e.currentTarget as HTMLElement).style.background =
                            "transparent";
                    }}
                >
                    <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </button>

                {/* divider */}
                <div className="w-px h-5 mx-1" style={{ background: subtle }} />

                {/* user info + avatar */}
                <div className="flex items-center gap-2.5">
                    <div className="hidden md:block text-right">
                        <p
                            className="text-[12px] font-mono font-bold leading-none"
                            style={{ color: "#e0e0ff" }}
                        >
                            {user?.name || "Admin"}
                        </p>
                        <p
                            className="text-[10px] font-mono mt-0.5"
                            style={{ color: dim }}
                        >
                            {user?.email || "admin@system"}
                        </p>
                    </div>

                    {/* avatar */}
                    <div
                        className="relative w-8 h-8 rounded-sm border flex items-center justify-center text-[11px] font-mono font-bold shrink-0"
                        style={{
                            background:
                                "linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,200,255,0.08))",
                            borderColor: "rgba(0,255,136,0.3)",
                            color: accent,
                            boxShadow: "0 0 12px rgba(0,255,136,0.1)",
                        }}
                    >
                        {initials}
                        {/* online dot */}
                        <span
                            className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border"
                            style={{
                                background: accent,
                                borderColor: "#080810",
                                boxShadow: `0 0 5px ${accent}`,
                            }}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
