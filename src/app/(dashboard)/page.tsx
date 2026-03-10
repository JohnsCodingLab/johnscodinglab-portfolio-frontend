import {
    Eye,
    FolderKanban,
    FileText,
    Mail,
    TrendingUp,
    ArrowUpRight,
} from "lucide-react";

const stats = [
    {
        label: "Page Views",
        value: "12,482",
        change: "+18.2%",
        icon: Eye,
    },
    {
        label: "Active Projects",
        value: "14",
        change: "+2",
        icon: FolderKanban,
    },
    {
        label: "Blog Posts",
        value: "8",
        change: "6 published",
        icon: FileText,
    },
    {
        label: "Unread Messages",
        value: "3",
        change: "New today",
        icon: Mail,
    },
];

const activity = [
    {
        time: "12:31",
        event: "New contact message",
        source: "visitor@example.com",
    },
    {
        time: "10:22",
        event: "Blog post viewed",
        source: "/blog/my-latest-project",
    },
    {
        time: "08:14",
        event: "Portfolio visit",
        source: "linkedin.com",
    },
    {
        time: "Yesterday",
        event: "New contact message",
        source: "recruiter@company.com",
    },
];

export default function DashboardPage() {
    return (
        <div className="space-y-10">
            {/* HEADER */}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Portfolio Analytics
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Performance insights and recent activity
                    </p>
                </div>

                <div className="flex items-center gap-2 px-3 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-500">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Live
                </div>
            </div>

            {/* STATS */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className="group relative rounded-xl border bg-card p-5 hover:border-primary/40 transition overflow-hidden"
                    >
                        {/* Glow effect */}

                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),transparent_70%)]" />

                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">
                                {stat.label}
                            </p>

                            <stat.icon className="w-4 h-4 text-muted-foreground" />
                        </div>

                        <p className="text-3xl font-semibold font-mono">
                            {stat.value}
                        </p>

                        <div className="flex items-center gap-1 text-xs text-emerald-500 mt-2">
                            <TrendingUp className="w-3 h-3" />
                            {stat.change}
                        </div>
                    </div>
                ))}
            </div>

            {/* MAIN GRID */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ACTIVITY */}

                <div className="lg:col-span-2 rounded-xl border bg-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-semibold">Activity Log</h2>

                        <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                            View analytics
                            <ArrowUpRight className="w-3 h-3" />
                        </button>
                    </div>

                    <div className="space-y-4 font-mono text-xs">
                        {activity.map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 border-b pb-3 last:border-0"
                            >
                                <span className="text-muted-foreground w-16">
                                    [{item.time}]
                                </span>

                                <span className="flex-1">{item.event}</span>

                                <span className="text-muted-foreground">
                                    {item.source}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* QUICK ACTIONS */}

                <div className="rounded-xl border bg-card p-6">
                    <h2 className="text-sm font-semibold mb-6">
                        Quick Actions
                    </h2>

                    <div className="space-y-3">
                        {[
                            {
                                label: "Add Project",
                                icon: FolderKanban,
                                href: "/projects",
                            },
                            {
                                label: "Write Blog Post",
                                icon: FileText,
                                href: "/blog",
                            },
                            {
                                label: "View Messages",
                                icon: Mail,
                                href: "/contacts",
                            },
                        ].map((action) => (
                            <a
                                key={action.label}
                                href={action.href}
                                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition group"
                            >
                                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center group-hover:scale-110 transition">
                                    <action.icon className="w-4 h-4 text-primary" />
                                </div>

                                <span className="text-sm font-medium">
                                    {action.label}
                                </span>

                                <ArrowUpRight className="ml-auto w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
