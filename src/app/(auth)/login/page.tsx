"use client";

import { Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/validation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Lock } from "lucide-react";

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
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex flex-col justify-between bg-sidebar p-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold text-sm">
                        J
                    </div>
                    <span className="text-sidebar-foreground font-semibold text-sm">
                        JohnsCodingLab
                    </span>
                </div>

                <div className="space-y-4">
                    <blockquote className="text-sidebar-foreground/80 text-lg leading-relaxed">
                        &ldquo;Manage your portfolio, blog, and analytics from
                        one centralized dashboard. Built for speed.&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center text-sidebar-foreground text-xs font-medium">
                            LJ
                        </div>
                        <div>
                            <p className="text-sidebar-foreground text-sm font-medium">
                                Levi John Favour
                            </p>
                            <p className="text-sidebar-foreground/50 text-xs">
                                Full Stack Developer
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-sidebar-foreground/30 text-xs">
                    © {new Date().getFullYear()} JohnsCodingLab. All rights
                    reserved.
                </p>
            </div>

            {/* Right Panel - Form */}
            <div className="flex items-center justify-center p-6 bg-background">
                <div className="w-full max-w-sm space-y-8">
                    {/* Mobile logo */}
                    <div className="flex items-center gap-3 lg:hidden">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                            J
                        </div>
                        <span className="font-semibold text-sm">
                            JohnsCodingLab
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Sign in to your admin account to continue.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit((data) => login(data))}
                        className="space-y-5"
                    >
                        {error && (
                            <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium"
                            >
                                Email address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                {...register("email")}
                                aria-invalid={!!errors.email}
                                className="h-10"
                            />
                            {errors.email && (
                                <p className="text-xs text-destructive">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium"
                            >
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                {...register("password")}
                                aria-invalid={!!errors.password}
                                className="h-10"
                            />
                            {errors.password && (
                                <p className="text-xs text-destructive">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-10 font-medium"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Sign in
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-xs text-muted-foreground">
                        This portal is restricted to authorized administrators
                        only.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
