"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { Terminal, Eye, Globe, Monitor, Users, Activity } from "lucide-react";
import { useAnalyticsStats } from "@/hooks/use-analytics";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const accent = "#00ff88";
const dim = "#555577";
const subtle = "rgba(80,80,120,0.35)";
const chartBlue = "#00c8ff";

export default function AnalyticsPage() {
    const { data: stats, isLoading, error } = useAnalyticsStats();

    // Generate real chart data from recentViews array (limit to max 30 days)
    const chartData = useMemo(() => {
        if (!stats?.recentViews || stats.recentViews.length === 0) return [];

        // Reverse the recentViews to chronological order (oldest -> newest for the chart)
        const sortedViews = [...stats.recentViews].reverse();

        // Group page views by day
        const viewsByDate = sortedViews.reduce(
            (acc, view) => {
                const date = new Date(view.createdAt).toLocaleDateString(
                    "en-US",
                    { month: "short", day: "numeric" },
                );
                acc[date] = (acc[date] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>,
        );

        // Find date range
        const viewDates = Object.keys(viewsByDate);
        if (viewDates.length === 0) return [];

        // Return exactly the dates that had views in chronological order
        return viewDates.map((dateKey) => ({
            name: dateKey,
            views: viewsByDate[dateKey],
        }));
    }, [stats]);

    if (error) {
        return (
            <div className="p-6 text-[#ff3250] font-mono text-sm">
                Failed to load analytics data
            </div>
        );
    }

    return (
        <div
            className="space-y-6 min-h-screen p-6"
            style={{ background: "#080810" }}
        >
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
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
                        <span style={{ color: chartBlue }}>analytics</span>
                    </div>
                    <h1
                        className="text-xl font-mono font-bold tracking-tight"
                        style={{ color: "#e0e0ff" }}
                    >
                        _traffic_data
                    </h1>
                    <p className="text-[12px] font-mono" style={{ color: dim }}>
                        Visitor statistics and page performance
                    </p>
                </div>
            </div>

            {/* KEY METRICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    {
                        label: "TOTAL VIEWS",
                        value: stats?.totalViews || 0,
                        icon: Eye,
                        color: chartBlue,
                    },
                    {
                        label: "UNIQUE VISITORS",
                        value: stats?.uniqueVisitors || 0,
                        icon: Users,
                        color: accent,
                    },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="relative p-5 rounded-sm border overflow-hidden"
                        style={{
                            borderColor: subtle,
                            background: "rgba(255,255,255,0.01)",
                        }}
                    >
                        {/* Corner accent */}
                        <div
                            className="absolute top-0 right-0 w-8 h-8 opacity-20"
                            style={{
                                background: `radial-gradient(circle at top right, ${stat.color}, transparent)`,
                            }}
                        />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span
                                    className="text-[10px] font-mono tracking-widest uppercase"
                                    style={{ color: dim }}
                                >
                                    {stat.label}
                                </span>
                                <stat.icon
                                    className="h-4 w-4"
                                    style={{ color: stat.color }}
                                />
                            </div>
                            <div className="flex items-end gap-3">
                                <span
                                    className="text-3xl font-mono font-bold tracking-tighter"
                                    style={{ color: "#e0e0ff" }}
                                >
                                    {isLoading
                                        ? "..."
                                        : stat.value.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* CHARTS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* TRAFFIC CHART (Spans 2 columns) */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-2 rounded-sm border p-5"
                    style={{
                        borderColor: subtle,
                        background: "rgba(255,255,255,0.01)",
                    }}
                >
                    <div className="flex items-center gap-2 mb-6 text-[11px] font-mono tracking-widest uppercase">
                        <Activity
                            className="h-3.5 w-3.5"
                            style={{ color: chartBlue }}
                        />
                        <span style={{ color: "#e0e0ff" }}>
                            Traffic Overview (Last 50 Views)
                        </span>
                    </div>

                    <div className="h-[300px] w-full">
                        {isLoading ? (
                            <div
                                className="w-full h-full flex items-center justify-center font-mono text-[10px]"
                                style={{ color: dim }}
                            >
                                Loading chart data...
                            </div>
                        ) : chartData.length === 0 ? (
                            <div
                                className="w-full h-full flex items-center justify-center font-mono text-[10px]"
                                style={{ color: dim }}
                            >
                                No recent traffic to graph. View pages on the
                                frontend.
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={chartData}
                                    margin={{
                                        top: 10,
                                        right: 10,
                                        left: -20,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="colorViews"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor={chartBlue}
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor={chartBlue}
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(80,80,120,0.15)"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: dim,
                                            fontSize: 10,
                                            fontFamily: "monospace",
                                        }}
                                        dy={10}
                                        minTickGap={20}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: dim,
                                            fontSize: 10,
                                            fontFamily: "monospace",
                                        }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor:
                                                "rgba(12,12,20,0.95)",
                                            borderColor: "rgba(0,200,255,0.3)",
                                            borderRadius: "2px",
                                            fontFamily: "monospace",
                                            fontSize: "11px",
                                            color: "#e0e0ff",
                                            boxShadow:
                                                "0 0 20px rgba(0,0,0,0.5)",
                                        }}
                                        itemStyle={{ color: chartBlue }}
                                        cursor={{
                                            stroke: "rgba(0,200,255,0.2)",
                                            strokeWidth: 1,
                                            strokeDasharray: "3 3",
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="views"
                                        stroke={chartBlue}
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorViews)"
                                        animationDuration={1000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>

                {/* TOP PAGES */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-sm border p-5 flex flex-col"
                    style={{
                        borderColor: subtle,
                        background: "rgba(255,255,255,0.01)",
                    }}
                >
                    <div className="flex items-center gap-2 mb-6 text-[11px] font-mono tracking-widest uppercase">
                        <Monitor
                            className="h-3.5 w-3.5"
                            style={{ color: accent }}
                        />
                        <span style={{ color: "#e0e0ff" }}>Top Pages</span>
                    </div>

                    <div className="flex-1 space-y-4">
                        {isLoading ? (
                            <div
                                className="font-mono text-[10px]"
                                style={{ color: dim }}
                            >
                                Loading...
                            </div>
                        ) : stats?.topPages.length === 0 ? (
                            <div
                                className="font-mono text-[10px]"
                                style={{ color: dim }}
                            >
                                No data available
                            </div>
                        ) : (
                            stats?.topPages.map((page, i) => (
                                <div
                                    key={page.path}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden pr-4">
                                        <span
                                            className="text-[10px] font-mono w-4"
                                            style={{ color: dim }}
                                        >
                                            0{i + 1}
                                        </span>
                                        <span
                                            className="text-[12px] font-mono truncate"
                                            style={{ color: "#e0e0ff" }}
                                        >
                                            {page.path}
                                        </span>
                                    </div>
                                    <span
                                        className="text-[11px] font-mono font-bold shrink-0"
                                        style={{ color: accent }}
                                    >
                                        {page._count.path.toLocaleString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* RECENT ACTIVITY LIST */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-3 rounded-sm border p-5"
                    style={{
                        borderColor: subtle,
                        background: "rgba(255,255,255,0.01)",
                    }}
                >
                    <div className="flex items-center gap-2 mb-6 text-[11px] font-mono tracking-widest uppercase">
                        <Globe
                            className="h-3.5 w-3.5"
                            style={{ color: "#aa88ff" }}
                        />
                        <span style={{ color: "#e0e0ff" }}>
                            Recent Traffic Log (Top 10)
                        </span>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div
                                className="font-mono text-[10px]"
                                style={{ color: dim }}
                            >
                                Loading...
                            </div>
                        ) : stats?.recentViews.length === 0 ? (
                            <div
                                className="font-mono text-[10px]"
                                style={{ color: dim }}
                            >
                                No data available
                            </div>
                        ) : (
                            stats?.recentViews.slice(0, 10).map((view) => (
                                <div
                                    key={view.id}
                                    className="flexflex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono border-b pb-3 last:border-0 last:pb-0"
                                    style={{
                                        borderColor: "rgba(80,80,120,0.15)",
                                    }}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span style={{ color: "#e0e0ff" }}>
                                                {view.path}
                                            </span>
                                            {view.referrer && (
                                                <span
                                                    className="px-1.5 py-0.5 rounded-sm bg-[rgba(255,255,255,0.05)] text-[9px] truncate max-w-[150px]"
                                                    style={{ color: dim }}
                                                >
                                                    {view.referrer}
                                                </span>
                                            )}
                                        </div>
                                        <div
                                            className="text-[10px] truncate"
                                            style={{ color: dim }}
                                        >
                                            {view.userAgent || "Unknown Device"}
                                        </div>
                                    </div>
                                    <span
                                        className="shrink-0 text-[10px] mt-2 sm:mt-0"
                                        style={{ color: "#aa88ff" }}
                                    >
                                        {new Date(
                                            view.createdAt,
                                        ).toLocaleString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
