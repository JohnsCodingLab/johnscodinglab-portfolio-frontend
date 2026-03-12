import axios from "axios";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3008/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// REQUEST INTERCEPTOR — attaches the access token to every outgoing request
api.interceptors.request.use((config) => {
    const storeToken =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("jcl-auth") || "{}")?.state
                  ?.accessToken
            : null;
    const token = storeToken || localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

// RESPONSE INTERCEPTOR — handles 401 errors by silently refreshing the token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const { data } = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true },
                );

                const newToken = data.data?.accessToken || data.accessToken;

                // Update localStorage (direct key)
                localStorage.setItem("accessToken", newToken);

                // Update Zustand persisted store so AuthGuard stays happy
                const stored = JSON.parse(
                    localStorage.getItem("jcl-auth") || "{}",
                );
                if (stored.state) {
                    stored.state.accessToken = newToken;
                    localStorage.setItem("jcl-auth", JSON.stringify(stored));
                }

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed — clear everything and let AuthGuard handle redirect
                localStorage.removeItem("accessToken");
                const stored = JSON.parse(
                    localStorage.getItem("jcl-auth") || "{}",
                );
                if (stored.state) {
                    stored.state.user = null;
                    stored.state.accessToken = null;
                    localStorage.setItem("jcl-auth", JSON.stringify(stored));
                }
                // Clear the has_session cookie
                document.cookie =
                    "has_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                // Soft redirect — no full page reload
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);
