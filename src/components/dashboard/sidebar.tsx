"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FolderKanban,
    FileText,
    Mail,
    BarChart3,
    Settings,
    LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useUIStore } from "@/store/ui-store";
import { Badge } from "@/components/ui/badge";

const routes = [
    { label: "Overview", icon: LayoutDashboard, href: "/" },
    { label: "Projects", icon: FolderKanban, href: "/projects" },
    { label: "Blog Posts", icon: FileText, href: "/blog" },
    { label: "Messages", icon: Mail, href: "/contacts", showBadge: true },
    { label: "Analytics", icon: BarChart3, href: "/analytics" },
    { label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const unreadCount = useUIStore((s) => s.unreadContactCount);

    return (
        <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
                <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm">
                    J
                </div>
                <div>
                    <p className="text-sm font-semibold tracking-tight">
                        JohnsCodingLab
                    </p>
                    <p className="text-[10px] text-sidebar-foreground/50 uppercase tracking-wider">
                        Admin Portal
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 mb-3">
                    Navigation
                </p>
                {routes.map((route) => {
                    const isActive = pathname === route.href;
                    return (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150",
                                isActive
                                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                            )}
                        >
                            <route.icon
                                className={cn(
                                    "h-4 w-4 flex-shrink-0",
                                    isActive ? "text-sidebar-primary" : "",
                                )}
                            />
                            <span className="flex-1">{route.label}</span>
                            {route.showBadge && unreadCount > 0 && (
                                <Badge className="h-5 min-w-5 px-1.5 text-[10px] bg-sidebar-primary text-sidebar-primary-foreground">
                                    {unreadCount > 99 ? "99+" : unreadCount}
                                </Badge>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-sidebar-border">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground/60 hover:bg-destructive/10 hover:text-destructive transition-colors duration-150"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                </button>
            </div>
        </div>
    );
}
