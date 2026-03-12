"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    FolderKanban,
    FileText,
    Mail,
    BarChart3,
    Settings,
    LogOut,
    Terminal,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useUIStore } from "@/store/ui-store";

const routes = [
    { label: "Overview", icon: LayoutDashboard, href: "/", group: "main" },
    { label: "Projects", icon: FolderKanban, href: "/projects", group: "main" },
    { label: "Blog Posts", icon: FileText, href: "/blog", group: "main" },
    {
        label: "Messages",
        icon: Mail,
        href: "/contacts",
        group: "main",
        showBadge: true,
    },
    { label: "Analytics", icon: BarChart3, href: "/analytics", group: "main" },
    { label: "Settings", icon: Settings, href: "/settings", group: "system" },
];

const dim = "#555577";
const subtle = "rgba(80,80,120,0.35)";
const accent = "#00ff88";

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const unreadCount = useUIStore((s) => s.unreadContactCount);

    const mainRoutes = routes.filter((r) => r.group === "main");
    const systemRoutes = routes.filter((r) => r.group === "system");

    return (
        <div
            className="relative flex flex-col h-full bg-background overflow-hidden"
            style={{
                borderRight: `1px solid ${subtle}`,
            }}
        >
            {/* scanlines */}
            <div
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.018]"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(100,100,100,0.5) 2px, rgba(100,100,100,0.5) 4px)",
                }}
            />

            {/* vertical accent line */}
            <div
                className="absolute top-0 right-0 w-px h-full pointer-events-none"
                style={{
                    background: `linear-gradient(to bottom, transparent, rgba(0,255,136,0.15) 30%, rgba(0,255,136,0.08) 70%, transparent)`,
                }}
            />

            {/* ── LOGO ── */}
            <div
                className="relative z-10 flex items-center gap-3 px-4 py-5 border-b"
                style={{ borderColor: subtle }}
            >
                {/* avatar */}
                <div
                    className="relative w-8 h-8 rounded-sm flex items-center justify-center font-mono font-bold text-sm shrink-0 border"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,200,255,0.1))",
                        borderColor: "rgba(0,255,136,0.3)",
                        color: accent,
                        boxShadow: "0 0 12px rgba(0,255,136,0.1)",
                    }}
                >
                    J{/* pulse dot */}
                    <span
                        className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{
                            background: accent,
                            boxShadow: `0 0 4px ${accent}`,
                        }}
                    />
                </div>

                <div className="min-w-0">
                    <p
                        className="text-[13px] font-mono font-bold tracking-tight truncate"
                        style={{ color: "#e0e0ff" }}
                    >
                        JohnsCodingLab
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                        <Terminal
                            className="h-2.5 w-2.5"
                            style={{ color: accent }}
                        />
                        <p
                            className="text-[9px] font-mono tracking-[0.2em] uppercase"
                            style={{ color: dim }}
                        >
                            admin portal
                        </p>
                    </div>
                </div>
            </div>

            {/* ── NAV ── */}
            <nav className="relative z-10 flex-1 px-3 py-4 overflow-y-auto space-y-5">
                {/* main group */}
                <div>
                    <p
                        className="px-2 text-[9px] font-mono font-bold tracking-[0.25em] uppercase mb-2"
                        style={{ color: "rgba(80,80,120,0.6)" }}
                    >
                        navigation
                    </p>

                    <div className="space-y-0.5">
                        {mainRoutes.map((route) => {
                            const isActive = pathname === route.href;
                            return (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className="relative flex items-center gap-3 px-3 py-2 rounded-sm text-[12px] font-mono transition-all duration-150 group/item"
                                    style={{
                                        color: isActive ? "#e0e0ff" : dim,
                                        background: isActive
                                            ? "rgba(0,255,136,0.07)"
                                            : "transparent",
                                        border: `1px solid ${isActive ? "rgba(0,255,136,0.2)" : "transparent"}`,
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.background =
                                                "rgba(255,255,255,0.03)";
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.color = "#a0a0cc";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.background = "transparent";
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.color = dim;
                                        }
                                    }}
                                >
                                    {/* active left bar */}
                                    {isActive && (
                                        <span
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
                                            style={{
                                                background: accent,
                                                boxShadow: `0 0 8px ${accent}`,
                                            }}
                                        />
                                    )}

                                    <route.icon
                                        className="h-3.5 w-3.5 shrink-0"
                                        style={{
                                            color: isActive
                                                ? accent
                                                : "inherit",
                                        }}
                                    />

                                    <span className="flex-1 tracking-wide">
                                        {route.label}
                                    </span>

                                    {/* badge */}
                                    {route.showBadge && unreadCount > 0 && (
                                        <span
                                            className="inline-flex items-center justify-center h-4 min-w-4 px-1 text-[9px] font-mono font-bold rounded-sm border"
                                            style={{
                                                color: accent,
                                                borderColor:
                                                    "rgba(0,255,136,0.3)",
                                                background:
                                                    "rgba(0,255,136,0.1)",
                                            }}
                                        >
                                            {unreadCount > 99
                                                ? "99+"
                                                : unreadCount}
                                        </span>
                                    )}

                                    {/* active chevron */}
                                    {isActive && (
                                        <span
                                            className="text-[10px] font-mono"
                                            style={{
                                                color: "rgba(0,255,136,0.4)",
                                            }}
                                        >
                                            ▸
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* system group */}
                <div>
                    <p
                        className="px-2 text-[9px] font-mono font-bold tracking-[0.25em] uppercase mb-2"
                        style={{ color: "rgba(80,80,120,0.6)" }}
                    >
                        system
                    </p>
                    <div className="space-y-0.5">
                        {systemRoutes.map((route) => {
                            const isActive = pathname === route.href;
                            return (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className="relative flex items-center gap-3 px-3 py-2 rounded-sm text-[12px] font-mono transition-all duration-150"
                                    style={{
                                        color: isActive ? "#e0e0ff" : dim,
                                        background: isActive
                                            ? "rgba(0,255,136,0.07)"
                                            : "transparent",
                                        border: `1px solid ${isActive ? "rgba(0,255,136,0.2)" : "transparent"}`,
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.background =
                                                "rgba(255,255,255,0.03)";
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.color = "#a0a0cc";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.background = "transparent";
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.color = dim;
                                        }
                                    }}
                                >
                                    {isActive && (
                                        <span
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full"
                                            style={{
                                                background: accent,
                                                boxShadow: `0 0 8px ${accent}`,
                                            }}
                                        />
                                    )}
                                    <route.icon
                                        className="h-3.5 w-3.5 shrink-0"
                                        style={{
                                            color: isActive
                                                ? accent
                                                : "inherit",
                                        }}
                                    />
                                    <span className="flex-1 tracking-wide">
                                        {route.label}
                                    </span>
                                    {isActive && (
                                        <span
                                            className="text-[10px] font-mono"
                                            style={{
                                                color: "rgba(0,255,136,0.4)",
                                            }}
                                        >
                                            ▸
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* ── FOOTER ── */}
            <div
                className="relative z-10 px-3 py-4 border-t space-y-3"
                style={{ borderColor: subtle }}
            >
                {/* session info */}
                <div
                    className="flex items-center gap-2 px-3 py-2 rounded-sm border text-[10px] font-mono"
                    style={{
                        borderColor: subtle,
                        background: "rgba(255,255,255,0.02)",
                        color: dim,
                    }}
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse"
                        style={{ background: accent }}
                    />
                    <span className="truncate">session active</span>
                    <span
                        className="ml-auto"
                        style={{ color: "rgba(80,80,120,0.5)" }}
                    >
                        root
                    </span>
                </div>

                {/* sign out */}
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-sm border text-[12px] font-mono transition-all duration-150 active:scale-95"
                    style={{
                        borderColor: subtle,
                        color: dim,
                        background: "transparent",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                            "rgba(255,50,80,0.3)";
                        (e.currentTarget as HTMLElement).style.color =
                            "#ff3250";
                        (e.currentTarget as HTMLElement).style.background =
                            "rgba(255,50,80,0.06)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor =
                            subtle;
                        (e.currentTarget as HTMLElement).style.color = dim;
                        (e.currentTarget as HTMLElement).style.background =
                            "transparent";
                    }}
                >
                    <LogOut className="h-3.5 w-3.5 shrink-0" />
                    <span className="tracking-wide">Sign out</span>
                    <span className="ml-auto text-[9px] tracking-widest uppercase opacity-40">
                        logout()
                    </span>
                </button>
            </div>
        </div>
    );
}
