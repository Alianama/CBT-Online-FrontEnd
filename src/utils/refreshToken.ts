import axiosInstance from "./axiosInstance";
import {clearAuthData, getAuthData, setAccessToken} from "./storage";

const LOGOUT_URL: string = import.meta.env.VITE_LOGOUT_URL;

export const refreshAccessToken = async () => {
    const authData = getAuthData();
    const refreshToken = authData?.refreshToken;
    
    if (!refreshToken) {
        console.warn("No refresh token available");
        clearAuthData();
        window.location.href = LOGOUT_URL;
        return;
    }

    try {
        const {data} = await axiosInstance.post("/auth/refresh", {
            refresh_token: refreshToken.token,
            type: "access"
        });

        if (!data?.access_token?.token || !Number.isFinite(data.access_token.expired_at)) {
            console.error("Invalid access token response:", data);
            clearAuthData();
            window.location.href = LOGOUT_URL;
            return;
        }

        const newAccessToken = {
            token: data.access_token.token,
            expired_at: data.access_token.expired_at
        };
        
        setAccessToken(newAccessToken);
        axiosInstance.defaults.headers["Authorization"] = `Bearer ${newAccessToken.token}`;
        return newAccessToken;
    } catch (error) {
        console.error("Failed to refresh token:", error);
        clearAuthData();
        window.location.href = LOGOUT_URL;
        throw error;
    }
};
