"use client";

import {
    Eye,
    FolderKanban,
    FileText,
    Mail,
    TrendingUp,
    ArrowUpRight,
    Terminal,
    Activity,
} from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { useBlogPosts } from "@/hooks/use-blog";
import { useContacts } from "@/hooks/use-contact";
import { useAnalyticsStats } from "@/hooks/use-analytics";
import { useMemo } from "react";

const accent = "#00ff88";
const dim = "#555577";
const subtle = "rgba(80,80,120,0.35)";

const typeColor: Record<string, string> = {
    msg: "#ffaa00",
    view: "#00ccff",
    visit: "#00ff88",
};

const typeTag: Record<string, string> = {
    msg: "MSG",
    view: "GET",
    visit: "HIT",
};

const quickActions = [
    {
        label: "Add Project",
        icon: FolderKanban,
        href: "/projects",
        hint: "init project()",
    },
    {
        label: "Write Blog Post",
        icon: FileText,
        href: "/blog",
        hint: "create post()",
    },
    {
        label: "View Messages",
        icon: Mail,
        href: "/contacts",
        hint: "read inbox()",
    },
];

export default function DashboardPage() {
    // 1. Fetch real data
    const { data: projects } = useProjects();
    const { data: blogPosts } = useBlogPosts();
    const { data: contacts } = useContacts();
    const { data: analytics } = useAnalyticsStats();
    // 2. Compute dynamic stats
    const dynamicStats = useMemo(() => {
        const activeProjects =
            projects?.filter((p) => !p.published).length || 0;
        const publishedBlogs =
            blogPosts?.filter((b) => b.published).length || 0;
        const unreadMsgs = contacts?.filter((c) => !c.read).length || 0;
        const totalViews = analytics?.totalViews || 0;
        return [
            {
                label: "Page Views",
                value: totalViews.toLocaleString(),
                change: "Lifetime",
                icon: Eye,
                color: "#00ff88",
            },
            {
                label: "Active Drafts",
                value: activeProjects.toString(),
                change: `${projects?.filter((p) => p.published).length || 0} deployed`,
                icon: FolderKanban,
                color: "#00ccff",
            },
            {
                label: "Blog Posts",
                value: (blogPosts?.length || 0).toString(),
                change: `${publishedBlogs} published`,
                icon: FileText,
                color: "#aa88ff",
            },
            {
                label: "Unread Messages",
                value: unreadMsgs.toString(),
                change: contacts?.length ? "Needs review" : "Inbox zero",
                icon: Mail,
                color: "#ffaa00",
            },
        ];
    }, [projects, blogPosts, contacts, analytics]);

    const liveActivity = useMemo(() => {
        const events: {
            time: string;
            event: string;
            source: string;
            type: "msg" | "view" | "visit";
        }[] = [];

        // Add recent messages
        contacts?.slice(0, 10).forEach((msg) => {
            events.push({
                time: msg.createdAt,
                event: msg.subject.slice(0, 30) + "...",
                source: msg.email,
                type: "msg",
            });
        });

        // Add recent analytics
        analytics?.recentViews.forEach((view) => {
            events.push({
                time: view.createdAt,
                event: view.path,
                source:
                    view.referrer || view.userAgent?.split(" ")[0] || "Unknown",
                type: "view",
            });
        });

        // Sort by newest first and grab top 10
        return events
            .sort(
                (a, b) =>
                    new Date(b.time).getTime() - new Date(a.time).getTime(),
            )
            .slice(0, 10)
            .map((e) => ({
                ...e,
                // Format the time nicely
                time: new Date(e.time).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            }));
    }, [contacts, analytics]);

    return (
        <div className="space-y-8 min-h-screen p-6 bg-background">
            {/* ── HEADER ── */}
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <div
                        className="flex items-center gap-1.5 text-[10px] font-mono mb-2"
                        style={{ color: dim }}
                    >
                        <Terminal
                            className="h-3 w-3"
                            style={{ color: "rgba(0,255,136,0.5)" }}
                        />
                        <span>portfolio</span>
                        <span style={{ color: "rgba(0,255,136,0.3)" }}>/</span>
                        <span style={{ color: accent }}>overview</span>
                    </div>
                    <h1
                        className="text-xl font-mono font-bold tracking-tight"
                        style={{ color: "#e0e0ff" }}
                    >
                        _portfolio_analytics
                    </h1>
                    <p className="text-[12px] font-mono" style={{ color: dim }}>
                        performance insights and recent activity
                    </p>
                </div>

                <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-sm border text-[10px] font-mono tracking-widest uppercase"
                    style={{
                        color: accent,
                        borderColor: "rgba(0,255,136,0.3)",
                        background: "rgba(0,255,136,0.07)",
                    }}
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: accent }}
                    />
                    Live
                </div>
            </div>

            {/* ── STAT CARDS ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {dynamicStats.map((stat) => (
                    <div
                        key={stat.label}
                        className="group relative rounded-sm border overflow-hidden transition-all duration-200 bg-card"
                        style={{ borderColor: subtle }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor =
                                `${stat.color}40`;
                            (e.currentTarget as HTMLElement).style.boxShadow =
                                `0 0 24px ${stat.color}08`;
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor =
                                subtle;
                            (e.currentTarget as HTMLElement).style.boxShadow =
                                "none";
                        }}
                    >
                        {/* scanline */}
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.02]"
                            style={{
                                backgroundImage:
                                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)",
                            }}
                        />

                        {/* top color bar */}
                        <div
                            className="h-0.5 w-full"
                            style={{
                                background: `linear-gradient(to right, ${stat.color}60, transparent)`,
                            }}
                        />

                        <div className="relative z-10 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <span
                                    className="text-[9px] font-mono tracking-[0.2em] uppercase"
                                    style={{ color: dim }}
                                >
                                    {stat.label}
                                </span>
                                <div
                                    className="w-7 h-7 rounded-sm border flex items-center justify-center"
                                    style={{
                                        borderColor: `${stat.color}25`,
                                        background: `${stat.color}0d`,
                                    }}
                                >
                                    <stat.icon
                                        className="w-3.5 h-3.5"
                                        style={{ color: stat.color }}
                                    />
                                </div>
                            </div>

                            <p
                                className="text-2xl font-mono font-bold mb-2"
                                style={{ color: "#e0e0ff" }}
                            >
                                {stat.value}
                            </p>

                            <div
                                className="flex items-center gap-1 text-[10px] font-mono"
                                style={{ color: stat.color }}
                            >
                                <TrendingUp className="w-3 h-3" />
                                {stat.change}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── MAIN GRID ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* ACTIVITY LOG */}
                <div
                    className="lg:col-span-2 rounded-sm border overflow-hidden bg-card"
                    style={{ borderColor: subtle }}
                >
                    {/* header */}
                    <div
                        className="flex items-center justify-between px-5 py-3.5 border-b"
                        style={{ borderColor: subtle }}
                    >
                        <div className="flex items-center gap-2">
                            <Activity
                                className="h-3.5 w-3.5"
                                style={{ color: accent }}
                            />
                            <span
                                className="text-[11px] font-mono font-bold tracking-widest uppercase"
                                style={{ color: "#e0e0ff" }}
                            >
                                Activity Log
                            </span>
                        </div>
                        <a
                            href="/analytics"
                            className="flex items-center gap-1 text-[10px] font-mono transition-colors"
                            style={{ color: dim }}
                            onMouseEnter={(e) =>
                                ((e.currentTarget as HTMLElement).style.color =
                                    accent)
                            }
                            onMouseLeave={(e) =>
                                ((e.currentTarget as HTMLElement).style.color =
                                    dim)
                            }
                        >
                            view analytics
                            <ArrowUpRight className="w-3 h-3" />
                        </a>
                    </div>

                    {/* log rows */}
                    <div className="divide-y" style={{ borderColor: subtle }}>
                        {liveActivity.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 px-5 py-3 text-[11px] font-mono transition-colors"
                                style={{ borderColor: subtle }}
                                onMouseEnter={(e) =>
                                    ((
                                        e.currentTarget as HTMLElement
                                    ).style.background =
                                        "rgba(255,255,255,0.02)")
                                }
                                onMouseLeave={(e) =>
                                    ((
                                        e.currentTarget as HTMLElement
                                    ).style.background = "transparent")
                                }
                            >
                                {/* time */}
                                <span
                                    className="w-20 shrink-0"
                                    style={{ color: "rgba(80,80,120,0.7)" }}
                                >
                                    [{item.time}]
                                </span>

                                {/* type tag */}
                                <span
                                    className="w-10 shrink-0 text-center text-[9px] py-0.5 rounded-sm border"
                                    style={{
                                        color: typeColor[item.type],
                                        borderColor: `${typeColor[item.type]}30`,
                                        background: `${typeColor[item.type]}0d`,
                                    }}
                                >
                                    {typeTag[item.type]}
                                </span>

                                {/* event */}
                                <span
                                    className="flex-1 truncate"
                                    style={{ color: "#c0c0e0" }}
                                >
                                    {item.event}
                                </span>

                                {/* source */}
                                <span
                                    className="hidden sm:block truncate max-w-[180px]"
                                    style={{ color: dim }}
                                >
                                    {item.source}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* footer */}
                    <div
                        className="px-5 py-2.5 border-t text-[10px] font-mono"
                        style={{
                            borderColor: subtle,
                            color: "rgba(80,80,120,0.5)",
                        }}
                    >
                        showing last {liveActivity.length} events —
                        auto-refreshes every 30s
                    </div>
                </div>

                {/* QUICK ACTIONS */}
                <div
                    className="rounded-sm border overflow-hidden bg-card"
                    style={{ borderColor: subtle }}
                >
                    {/* header */}
                    <div
                        className="flex items-center gap-2 px-5 py-3.5 border-b"
                        style={{ borderColor: subtle }}
                    >
                        <span
                            className="text-[10px] font-mono"
                            style={{ color: accent }}
                        >
                            ▸
                        </span>
                        <span
                            className="text-[11px] font-mono font-bold tracking-widest uppercase"
                            style={{ color: "#e0e0ff" }}
                        >
                            Quick Actions
                        </span>
                    </div>

                    <div className="p-4 space-y-2">
                        {quickActions.map((action, i) => (
                            <a
                                key={action.label}
                                href={action.href}
                                className="group/action flex items-center gap-3 p-3 rounded-sm border transition-all duration-150"
                                style={{
                                    borderColor: subtle,
                                    background: "transparent",
                                }}
                                onMouseEnter={(e) => {
                                    (
                                        e.currentTarget as HTMLElement
                                    ).style.borderColor =
                                        "rgba(0,255,136,0.25)";
                                    (
                                        e.currentTarget as HTMLElement
                                    ).style.background = "rgba(0,255,136,0.05)";
                                }}
                                onMouseLeave={(e) => {
                                    (
                                        e.currentTarget as HTMLElement
                                    ).style.borderColor = subtle;
                                    (
                                        e.currentTarget as HTMLElement
                                    ).style.background = "transparent";
                                }}
                            >
                                {/* index */}
                                <span
                                    className="text-[9px] font-mono w-4 shrink-0"
                                    style={{ color: "rgba(80,80,120,0.5)" }}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </span>

                                {/* icon */}
                                <div
                                    className="w-7 h-7 rounded-sm border flex items-center justify-center shrink-0"
                                    style={{
                                        borderColor: "rgba(0,255,136,0.2)",
                                        background: "rgba(0,255,136,0.07)",
                                    }}
                                >
                                    <action.icon
                                        className="w-3.5 h-3.5"
                                        style={{ color: accent }}
                                    />
                                </div>

                                {/* label + hint */}
                                <div className="flex-1 min-w-0">
                                    <p
                                        className="text-[12px] font-mono font-bold"
                                        style={{ color: "#e0e0ff" }}
                                    >
                                        {action.label}
                                    </p>
                                    <p
                                        className="text-[10px] font-mono"
                                        style={{ color: dim }}
                                    >
                                        {action.hint}
                                    </p>
                                </div>

                                <ArrowUpRight
                                    className="w-3.5 h-3.5 shrink-0 transition-transform group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5"
                                    style={{ color: dim }}
                                />
                            </a>
                        ))}
                    </div>

                    {/* system status footer */}
                    <div
                        className="mx-4 mb-4 px-3 py-2.5 rounded-sm border text-[10px] font-mono space-y-1.5"
                        style={{
                            borderColor: subtle,
                            background: "rgba(255,255,255,0.02)",
                        }}
                    >
                        <p
                            className="text-[9px] tracking-widest uppercase"
                            style={{ color: "rgba(80,80,120,0.6)" }}
                        >
                            sys status
                        </p>
                        {[
                            { label: "API", status: "ONLINE", color: accent },
                            {
                                label: "Database",
                                status: "HEALTHY",
                                color: accent,
                            },
                            { label: "CDN", status: "ONLINE", color: accent },
                        ].map(({ label, status, color }) => (
                            <div
                                key={label}
                                className="flex items-center justify-between"
                            >
                                <span style={{ color: dim }}>{label}</span>
                                <span
                                    className="flex items-center gap-1"
                                    style={{ color }}
                                >
                                    <span
                                        className="w-1 h-1 rounded-full animate-pulse"
                                        style={{ background: color }}
                                    />
                                    {status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
