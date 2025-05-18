import axios from "axios";
import {clearAuthData, getAuthData, setAccessToken} from "./storage";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const LOGOUT_URL = import.meta.env.VITE_LOGOUT_URL;
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {"Content-Type": "application/json"},
});
axiosInstance.interceptors.request.use(
    (config) => {
        const {accessToken} = getAuthData();
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken.token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const {refreshToken} = getAuthData();
            
            if (!refreshToken) {
                console.error("No refresh token available");
                clearAuthData();
                window.location.href = LOGOUT_URL;
                return Promise.reject(error);
            }

            try {
                const {data} = await axios.post(`${BASE_URL}/auth/refresh`, {
                    refresh_token: refreshToken.token,
                    type: "access"
                });

                if (!data?.access_token?.token || !Number.isFinite(data.access_token.expired_at)) {
                    console.error("Invalid access token response:", data);
                    clearAuthData();
                    window.location.href = LOGOUT_URL;
                    return Promise.reject(new Error("Invalid access token response structure"));
                }

                const newAccessToken = {
                    token: data.access_token.token,
                    expired_at: data.access_token.expired_at
                };
                setAccessToken(newAccessToken);
                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken.token}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);
                clearAuthData();
                window.location.href = LOGOUT_URL;
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);
export default axiosInstance;
