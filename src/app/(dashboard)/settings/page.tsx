"use client";

import { useAuthStore } from "@/store/auth-store";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import {
    Terminal,
    Mail,
    Shield,
    Key,
    Moon,
    Sun,
    Monitor,
    LogOut,
    CheckCircle2,
    Database,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const accent = "#00ff88";
const dim = "#555577";
const subtle = "rgba(80,80,120,0.35)";
const cyan = "#00c8ff";

export default function SettingsPage() {
    const user = useAuthStore((s) => s.user);
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const { theme, setTheme } = useTheme();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Prevent hydration mismatch for theme toggle
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            clearAuth();
            localStorage.removeItem("accessToken");
            document.cookie =
                "has_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            router.push("/login");
        }
    };

    if (!mounted) return null;

    return (
        <div
            className="space-y-8 min-h-screen p-6 max-w-5xl mx-auto"
            style={{ background: "#080810" }}
        >
            {/* HEADER */}
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
                    <span style={{ color: "#aa88ff" }}>settings</span>
                </div>
                <h1
                    className="text-xl font-mono font-bold tracking-tight"
                    style={{ color: "#e0e0ff" }}
                >
                    _system_config
                </h1>
                <p className="text-[12px] font-mono" style={{ color: dim }}>
                    Manage account preferences and application settings
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT COLUMN - PROFILE */}
                <div className="lg:col-span-1 space-y-6">
                    {/* User ID Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-sm border p-6 relative overflow-hidden"
                        style={{
                            borderColor: subtle,
                            background:
                                "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.2))",
                        }}
                    >
                        <div
                            className="absolute top-0 left-0 w-full h-1"
                            style={{
                                background:
                                    "linear-gradient(90deg, #00ff88, #00c8ff)",
                            }}
                        />

                        <div className="flex items-center gap-4 mb-6">
                            <div
                                className="w-16 h-16 rounded-sm border flex items-center justify-center text-xl font-mono font-bold"
                                style={{
                                    borderColor: "rgba(0,255,136,0.4)",
                                    background: "rgba(0,255,136,0.05)",
                                    color: accent,
                                    boxShadow: "0 0 20px rgba(0,255,136,0.1)",
                                }}
                            >
                                {user?.name
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .substring(0, 2)
                                    .toUpperCase() || "AD"}
                            </div>
                            <div>
                                <h2
                                    className="text-lg font-mono font-bold"
                                    style={{ color: "#e0e0ff" }}
                                >
                                    {user?.name || "Administrator"}
                                </h2>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Shield
                                        className="h-3 w-3"
                                        style={{ color: cyan }}
                                    />
                                    <span
                                        className="text-[10px] font-mono tracking-widest uppercase"
                                        style={{ color: cyan }}
                                    >
                                        {user?.role || "SUPER_ADMIN"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div
                                className="flex items-center gap-3 text-[12px] font-mono border-b pb-3"
                                style={{ borderColor: "rgba(80,80,120,0.2)" }}
                            >
                                <Mail
                                    className="h-4 w-4"
                                    style={{ color: dim }}
                                />
                                <span style={{ color: "#aaaacc" }}>
                                    {user?.email || "admin@system.local"}
                                </span>
                            </div>
                            <div
                                className="flex items-center gap-3 text-[12px] font-mono border-b pb-3"
                                style={{ borderColor: "rgba(80,80,120,0.2)" }}
                            >
                                <Key
                                    className="h-4 w-4"
                                    style={{ color: dim }}
                                />
                                <span style={{ color: "#aaaacc" }}>
                                    ID:{" "}
                                    {user?.id?.substring(0, 8) || "sys-0x1a"}...
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 text-[11px] font-mono font-bold tracking-widest uppercase rounded-sm transition-all duration-150 active:scale-95 disabled:opacity-50"
                            style={{
                                background: "rgba(255,50,80,0.05)",
                                border: "1px solid rgba(255,50,80,0.3)",
                                color: "#ff3250",
                            }}
                        >
                            {isLoggingOut ? (
                                <span className="animate-pulse">
                                    Terminating Session...
                                </span>
                            ) : (
                                <>
                                    <LogOut className="h-3.5 w-3.5" />
                                    End Session
                                </>
                            )}
                        </button>
                    </motion.div>
                </div>

                {/* RIGHT COLUMN - SETTINGS */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Appearance */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="rounded-sm border p-6"
                        style={{
                            borderColor: subtle,
                            background: "rgba(255,255,255,0.01)",
                        }}
                    >
                        <h3
                            className="text-[12px] font-mono font-bold mb-4 tracking-widest uppercase flex items-center gap-2"
                            style={{ color: "#e0e0ff" }}
                        >
                            <Monitor
                                className="h-4 w-4"
                                style={{ color: "#aa88ff" }}
                            />
                            Appearance Interface
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Dark Mode */}
                            <button
                                onClick={() => setTheme("dark")}
                                className="relative flex flex-col items-start p-4 rounded-sm border transition-all text-left"
                                style={{
                                    borderColor:
                                        theme === "dark" ? "#aa88ff" : subtle,
                                    background:
                                        theme === "dark"
                                            ? "rgba(170,136,255,0.05)"
                                            : "transparent",
                                }}
                            >
                                {theme === "dark" && (
                                    <CheckCircle2
                                        className="absolute top-3 right-3 h-4 w-4"
                                        style={{ color: "#aa88ff" }}
                                    />
                                )}
                                <Moon
                                    className="h-5 w-5 mb-3"
                                    style={{
                                        color:
                                            theme === "dark" ? "#aa88ff" : dim,
                                    }}
                                />
                                <span
                                    className="text-[12px] font-mono font-bold mb-1"
                                    style={{ color: "#e0e0ff" }}
                                >
                                    Dark Mode
                                </span>
                                <span
                                    className="text-[10px] font-mono"
                                    style={{ color: dim }}
                                >
                                    Deep space aesthetic with neon accents
                                </span>
                            </button>

                            {/* Light Mode */}
                            <button
                                onClick={() => setTheme("light")}
                                className="relative flex flex-col items-start p-4 rounded-sm border transition-all text-left opacity-50 cursor-not-allowed"
                                style={{
                                    borderColor:
                                        theme === "light" ? "#aa88ff" : subtle,
                                    background:
                                        theme === "light"
                                            ? "rgba(170,136,255,0.05)"
                                            : "transparent",
                                }}
                                disabled
                                title="Light mode is currently disabled in this build"
                            >
                                {theme === "light" && (
                                    <CheckCircle2
                                        className="absolute top-3 right-3 h-4 w-4"
                                        style={{ color: "#aa88ff" }}
                                    />
                                )}
                                <Sun
                                    className="h-5 w-5 mb-3"
                                    style={{
                                        color:
                                            theme === "light" ? "#aa88ff" : dim,
                                    }}
                                />
                                <span
                                    className="text-[12px] font-mono font-bold mb-1"
                                    style={{ color: "#aaaacc" }}
                                >
                                    Light Mode
                                </span>
                                <span
                                    className="text-[10px] font-mono"
                                    style={{ color: dim }}
                                >
                                    Currently overriding to dark theme
                                </span>
                            </button>
                        </div>
                    </motion.div>

                    {/* System Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="rounded-sm border p-6"
                        style={{
                            borderColor: subtle,
                            background: "rgba(255,255,255,0.01)",
                        }}
                    >
                        <h3
                            className="text-[12px] font-mono font-bold mb-4 tracking-widest uppercase flex items-center gap-2"
                            style={{ color: "#e0e0ff" }}
                        >
                            <Database
                                className="h-4 w-4"
                                style={{ color: accent }}
                            />
                            System Information
                        </h3>

                        <div className="space-y-3">
                            {[
                                {
                                    label: "Client Version",
                                    value: "v2.0.0-beta",
                                },
                                {
                                    label: "API Endpoint",
                                    value:
                                        process.env.NEXT_PUBLIC_API_URL?.replace(
                                            "/api",
                                            "",
                                        ) || "localhost:3008",
                                },
                                {
                                    label: "Environment",
                                    value:
                                        process.env.NODE_ENV || "development",
                                },
                                {
                                    label: "Session Status",
                                    value: "ACTIVE",
                                    color: accent,
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="flex justify-between items-center text-[11px] font-mono border-b pb-2 last:border-0 last:pb-0"
                                    style={{
                                        borderColor: "rgba(80,80,120,0.1)",
                                    }}
                                >
                                    <span style={{ color: dim }}>
                                        {item.label}
                                    </span>
                                    <span
                                        style={{
                                            color: item.color || "#aaaacc",
                                        }}
                                    >
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
