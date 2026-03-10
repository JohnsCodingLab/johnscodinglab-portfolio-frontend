import axios from "axios";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3008/api";

// Create a dedicated axios instance so all requests share the same config
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // IMPORTANT: sends httpOnly cookies (refresh token) with every request
});

// REQUEST INTERCEPTOR — attaches the access token to every outgoing request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// RESPONSE INTERCEPTOR — handles 401 errors by silently refreshing the token
api.interceptors.response.use(
    (response) => response, // Pass through successful responses
    async (error) => {
        const originalRequest = error.config;

        // If we get a 401 and haven't already tried refreshing, attempt a silent refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite retry loops

            try {
                // Call the refresh endpoint — the httpOnly cookie is sent automatically
                const { data } = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true },
                );

                // Store the new access token
                const newToken = data.data?.accessToken || data.accessToken;
                localStorage.setItem("accessToken", newToken);

                // Retry the original failed request with the new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed — token is fully expired, force re-login
                localStorage.removeItem("accessToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);

export default api;
