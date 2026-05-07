import axios from "axios";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://portfolio-api-pm4w.onrender.com/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

// Prevent multiple simultaneous refresh calls
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
}

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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                // Queue this request until refresh completes
                return new Promise((resolve) => {
                    refreshSubscribers.push((token: string) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            try {
                const { data } = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true },
                );

                const newToken = data.data?.accessToken || data.accessToken;

                localStorage.setItem("accessToken", newToken);

                const stored = JSON.parse(
                    localStorage.getItem("jcl-auth") || "{}",
                );
                if (stored.state) {
                    stored.state.accessToken = newToken;
                    localStorage.setItem("jcl-auth", JSON.stringify(stored));
                }

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                onRefreshed(newToken);
                isRefreshing = false;
                return api(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                refreshSubscribers = [];

                const status = axios.isAxiosError(refreshError)
                    ? refreshError.response?.status
                    : null;

                // Only redirect on definitive auth failures, NOT network errors
                if (status === 401 || status === 403) {
                    localStorage.removeItem("accessToken");
                    const stored = JSON.parse(
                        localStorage.getItem("jcl-auth") || "{}",
                    );
                    if (stored.state) {
                        stored.state.user = null;
                        stored.state.accessToken = null;
                        localStorage.setItem(
                            "jcl-auth",
                            JSON.stringify(stored),
                        );
                    }
                    document.cookie =
                        "has_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
