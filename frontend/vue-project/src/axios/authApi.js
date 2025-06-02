import axios from "axios";
import { BASE_URL } from "@/config";

const authApi = axios.create({
    baseURL: BASE_URL,
});

// Request interceptor to add Authorization header
authApi.interceptors.request.use(
    config => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor to handle 401 and refresh token
authApi.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const res = await axios.post(`${BASE_URL}/api/token/refresh/`, {
                        refresh: refreshToken,
                    });
                    const newAccess = res.data.access;
                    localStorage.setItem('access_token', newAccess);
                    // Update the Authorization header and retry the original request
                    originalRequest.headers['Authorization'] = 'Bearer ' + newAccess;
                    return authApi(originalRequest);
                }
            } catch (refreshError) {
                // If refresh fails, clear tokens and redirect to login if needed
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                console.error('Refresh token failed:', refreshError);
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default authApi;