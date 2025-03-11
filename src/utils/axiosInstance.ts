import axios from "axios";
import {clearAuthData, getAuthData, setAuthData} from "./storage";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {"Content-Type": "application/json"},
});
// Intercept request untuk menambahkan Authorization header
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
// Intercept response untuk menangani token expired (401)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const {refreshToken} = getAuthData();
            if (refreshToken) {
                try {
                    const {data} = await axios.post("http://localhost:8000/api/refresh-token", {
                        refresh_token: refreshToken.token,
                    });
                    // Perbarui token
                    setAuthData(data.access_token, data.refresh_token, getAuthData().userData!);
                    // Ulangi request dengan token baru
                    originalRequest.headers["Authorization"] = `Bearer ${data.access_token.token}`;
                    return axiosInstance(originalRequest);
                } catch (error) {
                    console.error("Token refresh failed, logging out...");
                    console.log(error);
                    clearAuthData();
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);
export default axiosInstance;
