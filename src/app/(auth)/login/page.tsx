"use client";

import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validation";
import { useAuth } from "@/hooks/use-auth";
import {
    AlertCircle,
    Loader2,
    Lock,
    Terminal,
    Shield,
    Cpu,
    Activity,
} from "lucide-react";
import { GuestGuard } from "@/components/auth/auth-guard";

const accent = "#00ff88";
const dim = "#555577";
const subtle = "rgba(80,80,120,0.35)";

const inputClass = `
    w-full bg-transparent border rounded-sm px-3 py-2.5 text-sm font-mono
    placeholder:text-[#333355] outline-none transition-all duration-200
    [border-color:rgba(80,80,120,0.5)]
    [color:#e0e0ff]
    focus:[border-color:rgba(0,255,136,0.5)]
    focus:[box-shadow:0_0_0_1px_rgba(0,255,136,0.12),_0_0_16px_rgba(0,255,136,0.06)]
`;

function MatrixColumn({
    chars,
    delay,
    duration,
    left,
}: {
    chars: string;
    delay: number;
    duration: number;
    left: string;
}) {
    return (
        <div
            className="absolute top-0 text-[10px] font-mono leading-4 select-none pointer-events-none"
            style={{
                left,
                color: "rgba(0,255,136,0.15)",
                animation: `fall ${duration}s linear ${delay}s infinite`,
                whiteSpace: "pre",
            }}
        >
            {chars}
        </div>
    );
}

const matrixCols = [
    {
        chars: "10110\n01001\n11010\n00101\n10011\n01110\n10100\n01011\n11001\n00110",
        delay: 0,
        duration: 8,
        left: "5%",
    },
    {
        chars: "01001\n10110\n00111\n11000\n01101\n10010\n00100\n11011\n01110\n10001",
        delay: 1.5,
        duration: 10,
        left: "18%",
    },
    {
        chars: "11010\n00101\n10110\n01001\n11100\n00011\n10101\n01010\n11001\n00110",
        delay: 0.8,
        duration: 7,
        left: "32%",
    },
    {
        chars: "00111\n11000\n01101\n10010\n00110\n11001\n01010\n10101\n00011\n11100",
        delay: 2.2,
        duration: 9,
        left: "58%",
    },
    {
        chars: "10010\n01101\n11000\n00111\n10011\n01100\n11010\n00101\n01110\n10001",
        delay: 0.4,
        duration: 11,
        left: "72%",
    },
    {
        chars: "01110\n10001\n00100\n11011\n01001\n10110\n00111\n11000\n01101\n10010",
        delay: 1.8,
        duration: 8,
        left: "88%",
    },
];

function LoginForm() {
    const { login, isLoading, error } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    return (
        <GuestGuard>
            <div
                className="min-h-screen grid lg:grid-cols-2"
                style={{ background: "#080810" }}
            >
                <style>{`
                @keyframes fall {
                    0%   { transform: translateY(-100%); opacity: 0; }
                    10%  { opacity: 1; }
                    90%  { opacity: 1; }
                    100% { transform: translateY(100vh); opacity: 0; }
                }
                @keyframes flicker {
                    0%, 100% { opacity: 1; }
                    92%       { opacity: 1; }
                    93%       { opacity: 0.4; }
                    94%       { opacity: 1; }
                    96%       { opacity: 0.6; }
                    97%       { opacity: 1; }
                }
            `}</style>

                {/* ── LEFT PANEL ── */}
                <div
                    className="hidden lg:flex flex-col justify-between overflow-hidden relative p-10 border-r"
                    style={{ borderColor: subtle, background: "#0a0a12" }}
                >
                    {/* scanlines */}
                    <div
                        className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
                        style={{
                            backgroundImage:
                                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)",
                        }}
                    />

                    {/* grid bg */}
                    <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(0,255,136,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,1) 1px, transparent 1px)",
                            backgroundSize: "40px 40px",
                        }}
                    />

                    {/* matrix rain */}
                    <div className="absolute inset-0 overflow-hidden">
                        {matrixCols.map((col, i) => (
                            <MatrixColumn key={i} {...col} />
                        ))}
                    </div>

                    {/* right border glow */}
                    <div
                        className="absolute right-0 top-0 w-px h-full pointer-events-none"
                        style={{
                            background: `linear-gradient(to bottom, transparent, rgba(0,255,136,0.2) 30%, rgba(0,255,136,0.1) 70%, transparent)`,
                        }}
                    />

                    {/* content */}
                    <div className="relative z-10 flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-sm border flex items-center justify-center font-mono font-bold text-sm"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,200,255,0.1))",
                                borderColor: "rgba(0,255,136,0.3)",
                                color: accent,
                                boxShadow: "0 0 12px rgba(0,255,136,0.12)",
                            }}
                        >
                            J
                        </div>
                        <div>
                            <p
                                className="text-[13px] font-mono font-bold"
                                style={{ color: "#e0e0ff" }}
                            >
                                JohnsCodingLab
                            </p>
                            <p
                                className="text-[9px] font-mono tracking-[0.2em] uppercase"
                                style={{ color: dim }}
                            >
                                admin portal
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-6">
                        {/* feature list */}
                        <div className="space-y-3">
                            {[
                                {
                                    icon: Cpu,
                                    text: "Manage projects & portfolio",
                                },
                                {
                                    icon: Activity,
                                    text: "Real-time analytics dashboard",
                                },
                                {
                                    icon: Shield,
                                    text: "Secure admin-only access",
                                },
                            ].map(({ icon: Icon, text }) => (
                                <div
                                    key={text}
                                    className="flex items-center gap-3"
                                >
                                    <div
                                        className="w-7 h-7 rounded-sm border flex items-center justify-center shrink-0"
                                        style={{
                                            borderColor: "rgba(0,255,136,0.2)",
                                            background: "rgba(0,255,136,0.07)",
                                        }}
                                    >
                                        <Icon
                                            className="h-3.5 w-3.5"
                                            style={{ color: accent }}
                                        />
                                    </div>
                                    <span
                                        className="text-[12px] font-mono"
                                        style={{ color: "#8888aa" }}
                                    >
                                        {text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* quote */}
                        <div
                            className="p-4 rounded-sm border"
                            style={{
                                borderColor: subtle,
                                background: "rgba(255,255,255,0.02)",
                            }}
                        >
                            <p
                                className="text-[12px] font-mono leading-relaxed mb-3"
                                style={{ color: "#8888aa" }}
                            >
                                &quot;Built for speed. One centralized dashboard
                                for your portfolio, blog, and analytics.&quot;
                            </p>
                            <div className="flex items-center gap-2.5">
                                <div
                                    className="w-7 h-7 rounded-sm border flex items-center justify-center text-[10px] font-mono font-bold"
                                    style={{
                                        borderColor: "rgba(0,255,136,0.25)",
                                        background: "rgba(0,255,136,0.08)",
                                        color: accent,
                                    }}
                                >
                                    LJ
                                </div>
                                <div>
                                    <p
                                        className="text-[11px] font-mono font-bold"
                                        style={{ color: "#e0e0ff" }}
                                    >
                                        Levi John Favour
                                    </p>
                                    <p
                                        className="text-[10px] font-mono"
                                        style={{ color: dim }}
                                    >
                                        Full Stack Developer
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p
                        className="relative z-10 text-[10px] font-mono"
                        style={{ color: "rgba(80,80,120,0.4)" }}
                    >
                        © {new Date().getFullYear()} JohnsCodingLab — all rights
                        reserved
                    </p>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div
                    className="flex items-center justify-center p-6 relative"
                    style={{ background: "#080810" }}
                >
                    {/* scanlines */}
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.018]"
                        style={{
                            backgroundImage:
                                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)",
                        }}
                    />

                    <div className="relative z-10 w-full max-w-sm space-y-7">
                        {/* mobile logo */}
                        <div className="flex items-center gap-3 lg:hidden">
                            <div
                                className="w-8 h-8 rounded-sm border flex items-center justify-center font-mono font-bold text-sm"
                                style={{
                                    borderColor: "rgba(0,255,136,0.3)",
                                    background: "rgba(0,255,136,0.08)",
                                    color: accent,
                                }}
                            >
                                J
                            </div>
                            <div>
                                <p
                                    className="text-[13px] font-mono font-bold"
                                    style={{ color: "#e0e0ff" }}
                                >
                                    JohnsCodingLab
                                </p>
                                <p
                                    className="text-[9px] font-mono tracking-[0.2em] uppercase"
                                    style={{ color: dim }}
                                >
                                    admin portal
                                </p>
                            </div>
                        </div>

                        {/* heading */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-3">
                                <span
                                    className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm border"
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
                                    SECURE ACCESS
                                </span>
                            </div>
                            <h1
                                className="text-xl font-mono font-bold tracking-tight"
                                style={{
                                    color: "#e0e0ff",
                                    animation: "flicker 8s infinite",
                                }}
                            >
                                _authenticate
                            </h1>
                            <p
                                className="text-[12px] font-mono"
                                style={{ color: dim }}
                            >
                                authorized personnel only
                            </p>
                        </div>

                        {/* form */}
                        <form
                            onSubmit={handleSubmit((data) => login(data))}
                            className="space-y-5"
                        >
                            {/* error */}
                            {error && (
                                <div
                                    className="flex items-start gap-2.5 rounded-sm border p-3 text-[11px] font-mono"
                                    style={{
                                        borderColor: "rgba(255,50,80,0.3)",
                                        background: "rgba(255,50,80,0.07)",
                                        color: "#ff3250",
                                    }}
                                >
                                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                    <p>✗ {error}</p>
                                </div>
                            )}

                            {/* email */}
                            <div className="space-y-1.5">
                                <label
                                    className="text-[10px] font-mono tracking-[0.2em] uppercase"
                                    style={{ color: dim }}
                                >
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    autoComplete="email"
                                    placeholder="admin@example.com"
                                    className={inputClass}
                                    {...register("email")}
                                />
                                {errors.email && (
                                    <p
                                        className="text-[11px] font-mono"
                                        style={{ color: "#ff3250" }}
                                    >
                                        ✗ {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* password */}
                            <div className="space-y-1.5">
                                <label
                                    className="text-[10px] font-mono tracking-[0.2em] uppercase"
                                    style={{ color: dim }}
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="••••••••••••"
                                    className={inputClass}
                                    {...register("password")}
                                />
                                {errors.password && (
                                    <p
                                        className="text-[11px] font-mono"
                                        style={{ color: "#ff3250" }}
                                    >
                                        ✗ {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* submit */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 py-2.5 text-[11px] font-mono font-bold tracking-widest uppercase rounded-sm border transition-all duration-150 active:scale-[0.99] disabled:opacity-50"
                                style={{
                                    background: isLoading
                                        ? "rgba(0,255,136,0.06)"
                                        : "linear-gradient(135deg, rgba(0,255,136,0.15), rgba(0,200,255,0.08))",
                                    border: "1px solid rgba(0,255,136,0.4)",
                                    color: accent,
                                    boxShadow: "0 0 24px rgba(0,255,136,0.08)",
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="h-3.5 w-3.5" />
                                        Authenticate
                                    </>
                                )}
                            </button>
                        </form>

                        {/* footer note */}
                        <div
                            className="flex items-center gap-2 px-3 py-2.5 rounded-sm border text-[10px] font-mono"
                            style={{
                                borderColor: subtle,
                                background: "rgba(255,255,255,0.02)",
                                color: dim,
                            }}
                        >
                            <Shield
                                className="h-3 w-3 shrink-0"
                                style={{ color: "rgba(0,255,136,0.4)" }}
                            />
                            This portal is restricted to authorized
                            administrators only.
                        </div>

                        {/* terminal prompt decoration */}
                        <div
                            className="flex items-center gap-2 text-[10px] font-mono"
                            style={{ color: "rgba(80,80,120,0.35)" }}
                        >
                            <Terminal className="h-3 w-3" />
                            <span>sys.auth.portal — v2.4.1</span>
                            <span
                                className="ml-auto animate-pulse"
                                style={{ color: "rgba(0,255,136,0.25)" }}
                            >
                                ▌
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </GuestGuard>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
