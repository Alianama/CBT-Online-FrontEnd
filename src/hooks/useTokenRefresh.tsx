import {useEffect} from "react";
import {refreshAccessToken} from "../utils/refreshToken";
import {getAuthData} from "../utils/storage";

const useTokenRefresh = () => {
    useEffect(() => {
        const checkAndRefreshToken = async () => {
            const authData = getAuthData();
            if (!authData?.accessToken || !authData?.refreshToken) {
                return;
            }

            const now = Date.now() / 1000;
            const timeUntilExpiry = authData.accessToken.expired_at - now;
            
            // Refresh token 5 menit sebelum expired
            if (timeUntilExpiry < 300) {
                try {
                    await refreshAccessToken();
                } catch (error) {
                    console.error("Error refreshing token:", error);
                }
            }
        };

        // Check token setiap 1 menit
        const interval = setInterval(checkAndRefreshToken, 60 * 1000);
        
        // Initial check
        checkAndRefreshToken();

        return () => clearInterval(interval);
    }, []);
    return null;
};

export default useTokenRefresh;
