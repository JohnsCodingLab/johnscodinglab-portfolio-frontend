import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen flex overflow-hidden bg-background">
            {/* Sidebar — uses shadcn CSS variables so it auto flips in dark mode */}
            <div className="hidden md:flex h-full w-64 flex-col flex-shrink-0 border-r border-border">
                <Sidebar />
            </div>

            {/* Main */}
            <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
