import axiosInstance from "./axiosInstance";
import {clearAuthData, getAuthData, setAccessToken} from "./storage";

const LOGOUT_URL: string = import.meta.env.VITE_LOGOUT_URL;
export const refreshAccessToken = async () => {
    const authData = getAuthData();
    const refreshToken = authData?.refreshToken;
    if (!refreshToken) return;
    try {
        const {data} = await axiosInstance.post("/auth/refresh", {
            refresh_token: refreshToken,
            type: "access"
        });
        console.log(data)
        if (!data?.access_token || !data?.refresh_token) {
            console.warn("Invalid token response, logging out...");
            clearAuthData();
            window.location.href = LOGOUT_URL;
            return;
        }
        setAccessToken(data.access_token);
    } catch (error) {
        console.error("Failed to refresh token, logging out...", error);
        clearAuthData();
        window.location.href = LOGOUT_URL;
    }
};
