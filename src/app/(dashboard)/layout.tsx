"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useTokenRefresh } from "@/hooks/use-token-refresh";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    useTokenRefresh();
    return (
        <AuthGuard>
            <div className="h-screen flex overflow-hidden bg-background">
                {/* Sidebar — uses shadcn CSS variables so it auto flips in dark mode */}
                <div className="hidden md:flex h-full w-64 flex-col shrink-0 border-r border-border">
                    <Sidebar />
                </div>

                {/* Main */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto md:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
