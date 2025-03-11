import axiosInstance from "./axiosInstance";
import {clearAuthData, getAuthData, setAuthData} from "./storage";

export const refreshAccessToken = async () => {
    const {refreshToken} = getAuthData();
    if (refreshToken) {
        try {
            const {data} = await axiosInstance.post("/refresh-token", {
                refresh_token: refreshToken.token,
            });
            setAuthData(data.access_token, data.refresh_token, getAuthData().userData!);
        } catch (error) {
            console.error("Failed to refresh token, logging out...");
            console.log(error);
            clearAuthData();
            window.location.href = "/login";
        }
    }
};
