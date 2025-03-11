import {useEffect} from "react";
import {refreshAccessToken} from "../utils/refreshToken";

const useTokenRefresh = () => {
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                await refreshAccessToken();
            } catch (error) {
                console.error("Error refreshing token:", error);
            }
        }, 5 * 60 * 1000); // Setiap 5 menit
        return () => clearInterval(interval);
    }, []);
    return null;
};
export default useTokenRefresh;
