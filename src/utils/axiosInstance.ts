import axios from "axios";
import {clearAuthData, getAuthData, setAccessToken} from "./storage";

const BASE_URL = import.meta.env.VITE_BASE_URL;
// const LOGOUT_URL = import.meta.env.VITE_LOGOUT_URL;
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
        if (error.response?.status === 401 ) {
            originalRequest._retry = true;
            const {refreshToken} = getAuthData();
            console.log(refreshToken);
            if (refreshToken) {
                try {
                    console.log(refreshToken);
                    const {data} = await axios.post(`${BASE_URL}/auth/refresh`, {
                        refresh_token: refreshToken.token,
                        type: "access"
                    });
                    console.log("New Access Token:", data);
                    if (!data?.access_token.token || !data.access_token.token || !Number.isFinite(data.access_token.expired_at)) {
                        console.error("Invalid access token response:", data);
                        return Promise.reject(new Error("Invalid access token response structure"));
                    }
                    const newAccessToken = {
                        token: data.access_token.token,
                        expired_at: data.access_token.expired_at
                    };
                    setAccessToken(newAccessToken);
                    originalRequest.headers["Authorization"] = `Bearer ${newAccessToken.token}`;
                    console.log("berhasil")
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error("Token refresh failed, logging out...");
                    console.log(refreshError);
                    clearAuthData();

                    // window.location.href = LOGOUT_URL;
                }
            }
        }
        return Promise.reject(error);
    }
);
export default axiosInstance;
