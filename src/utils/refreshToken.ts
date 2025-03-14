import axiosInstance from "./axiosInstance";
import {clearAuthData, getAuthData, setAccessToken} from "./storage";

const LOGOUT_URL: string = import.meta.env.VITE_LOGOUT_URL;
export const refreshAccessToken = async () => {
    const authData = getAuthData();
    const refreshToken = authData?.refreshToken;
    if (!refreshToken) {
        console.warn("No refresh token available, logging out...");
        clearAuthData();
        window.location.href = LOGOUT_URL;
        return;
    }
    try {
        console.log("Attempting to refresh token...");
        const {data} = await axiosInstance.post("/auth/refresh", {
            refresh_token: refreshToken.token,
            type: "access"
        });
        console.log("Token refresh response:", data);
        if (!data?.access_token || !data.access_token.access_token || !Number.isFinite(data.access_token.expired_at)) {
            console.error("Invalid access token response:", data);
            clearAuthData();
            window.location.href = LOGOUT_URL;
            return;
        }
        const newAccessToken = {
            token: data.access_token.access_token,
            expired_at: data.access_token.expired_at
        };
        setAccessToken(newAccessToken);
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${newAccessToken.token}`;
        console.log("Token successfully refreshed");
    } catch (error) {
        console.error("Failed to refresh token, logging out...", error);
        clearAuthData();
        window.location.href = LOGOUT_URL;
    }
};
