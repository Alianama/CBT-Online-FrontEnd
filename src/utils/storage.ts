export interface Token {
    token: string;
    expired_at: number;
}

export interface UserData {
    user_id: number;
    user_type: number;
    id_kelas: number;
    nama_siswa: string;
    nis: string;
    ban: number;
    username: string;
}

export const setAuthData = (accessToken: Token, refreshToken: Token, userData: UserData) => {
    localStorage.setItem("access_token", JSON.stringify(accessToken));
    localStorage.setItem("refresh_token", JSON.stringify(refreshToken));
    localStorage.setItem("user_data", JSON.stringify(userData));
};
export const getAuthData = () => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    const userData = localStorage.getItem("user_data");
    return {
        accessToken: accessToken ? JSON.parse(accessToken) as Token : null,
        refreshToken: refreshToken ? JSON.parse(refreshToken) as Token : null,
        userData: userData ? JSON.parse(userData) as UserData : null,
    };
};
export const clearAuthData = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
};
