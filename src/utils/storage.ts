import { Token, UserData } from "@/types/types.ts";

export const setAccessToken = (accessToken: Token) => {
  localStorage.setItem("access_token", JSON.stringify(accessToken));
};
export const setRefreshToken = (refreshToken: Token) => {
  localStorage.setItem("refresh_token", JSON.stringify(refreshToken));
};
export const setUserData = (userData: UserData) => {
  localStorage.setItem("user_data", JSON.stringify(userData));
};
export const setSchoolName = (schoolName: string) => {
  localStorage.setItem("school_name", JSON.stringify(schoolName));
};
export const getAuthData = () => {
  const accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");
  const userData = localStorage.getItem("user_data");
  const schoolName = localStorage.getItem("school_name");
  return {
    accessToken: accessToken ? (JSON.parse(accessToken) as Token) : null,
    refreshToken: refreshToken ? (JSON.parse(refreshToken) as Token) : null,
    userData: userData ? (JSON.parse(userData) as UserData) : null,
    schoolName: schoolName ? (JSON.parse(schoolName) as string) : null,
  };
};
export const clearAuthData = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_data");
};
