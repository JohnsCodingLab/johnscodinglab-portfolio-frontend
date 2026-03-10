"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth-store";
import { useUIStore } from "@/store/ui-store";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu } from "lucide-react";

export function Header() {
    // Read directly from Zustand — no useEffect needed!
    const user = useAuthStore((state) => state.user);
    const { toggleMobileSidebar } = useUIStore();
    const { theme, setTheme } = useTheme();

    const getInitials = (name: string) =>
        name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase() || "AD";

    return (
        <header className="flex items-center h-16 px-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
            {/* Mobile sidebar toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-2"
                onClick={toggleMobileSidebar}
            >
                <Menu className="h-5 w-5" />
            </Button>

            <div className="ml-auto flex items-center gap-x-3">
                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="text-muted-foreground hover:text-foreground"
                >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                {/* User Info */}
                <div className="text-right hidden md:block">
                    <p className="text-sm font-medium leading-none">
                        {user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {user?.email}
                    </p>
                </div>
                <Avatar className="h-8 w-8 border border-border">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                        {getInitials(user?.name || "Admin")}
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}
