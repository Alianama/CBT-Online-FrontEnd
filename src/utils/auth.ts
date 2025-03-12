import {getAuthData} from "./storage";

export const isAuthenticated = (): boolean => {
    const authData = getAuthData();
    return !!(authData && authData.accessToken && authData.refreshToken);
};
