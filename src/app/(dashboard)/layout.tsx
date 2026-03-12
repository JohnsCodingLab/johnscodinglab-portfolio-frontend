"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTokenRefresh } from "@/hooks/use-token-refresh";
import { useUIStore } from "@/store/ui-store";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useTokenRefresh();
    const { isMobileSidebarOpen, closeMobileSidebar } = useUIStore();

    return (
        <AuthGuard>
            <div className="h-screen flex overflow-hidden bg-background">
                {/* Mobile Sidebar overlay */}
                {isMobileSidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
                        onClick={closeMobileSidebar}
                    />
                )}

                {/* Sidebar (Desktop & Mobile) */}
                <div
                    className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col shrink-0 border-r border-border bg-background ${
                        isMobileSidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }`}
                >
                    <Sidebar />
                </div>

                {/* Main Content */}
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto w-full md:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
