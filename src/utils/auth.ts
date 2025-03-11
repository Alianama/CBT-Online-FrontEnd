import {clearAuthData, getAuthData} from "./storage";

export const isTokenExpired = (token: { expired_at: number }) => {
    return Date.now() / 1000 > token.expired_at;
};
export const isAuthenticated = (): boolean => {
    const {accessToken, refreshToken} = getAuthData();
    if (accessToken && !isTokenExpired(accessToken)) return true;
    if (refreshToken && !isTokenExpired(refreshToken)) return true;
    clearAuthData();
    return false;
};
