import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { ApiResponse, AuthResponse } from "@/types";
import { LoginFormData } from "@/lib/validation";
import { AxiosError } from "axios";
import { useAuthStore } from "@/store/auth-store";
import { useState } from "react";

export function useAuth() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setAuth, clearAuth, user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (data: LoginFormData) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.post<ApiResponse<AuthResponse>>(
                "/auth/login",
                data,
            );
            const { accessToken, user } = response.data.data;

            setAuth(user, accessToken);
            localStorage.setItem("accessToken", accessToken);
            document.cookie =
                "has_session=true; path=/; max-age=604800; SameSite=Lax";

            // Redirect to the page they were trying to visit, or default to "/"
            const redirectTo = searchParams.get("redirect") || "/";
            router.push(redirectTo);
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                setError(
                    err.response?.data?.message ||
                        "Login failed. Please check your credentials.",
                );
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            clearAuth();
            localStorage.removeItem("accessToken");
            document.cookie =
                "has_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            router.push("/login");
        }
    };

    return { login, logout, user, isLoading, error };
}
