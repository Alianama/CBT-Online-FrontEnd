import axiosInstance from "@/utils/axiosInstance";
import { getAuthData, setAccessToken, clearAuthData } from "@/utils/storage";

let refreshPromise: Promise<boolean> | null = null;

export const isAuthenticated = async (): Promise<boolean> => {
  const authData = getAuthData();
  if (!authData?.accessToken || !authData?.refreshToken) {
    return false;
  }

  const now = Date.now() / 1000;
  if (authData.accessToken.expired_at > now) {
    return true;
  }

  console.log("Access token expired, trying to refresh...");

  // Jika sedang proses refresh, tunggu promise yang sudah ada
  if (refreshPromise) {
    return await refreshPromise;
  }

  // Kalau belum ada, buat refreshPromise dan jalankan
  refreshPromise = refreshAccessToken();

  const result = await refreshPromise;

  // Setelah selesai, kosongkan refreshPromise agar siap untuk permintaan selanjutnya
  refreshPromise = null;

  return result;
};

const refreshAccessToken = async (): Promise<boolean> => {
  const { refreshToken } = getAuthData();
  if (!refreshToken) return false;

  try {
    const { data } = await axiosInstance.post("/auth/refresh", {
      refresh_token: refreshToken.token,
      type: "access",
    });

    if (
      !data?.access_token?.token ||
      !Number.isFinite(data.access_token.expired_at)
    ) {
      console.error("Invalid access token response:", data);
      return false;
    }

    setAccessToken({
      token: data.access_token.token,
      expired_at: data.access_token.expired_at,
    });

    console.log("Access token refreshed!", data.access_token.token);
    return true;
  } catch (error) {
    console.error("Failed to refresh token", error);
    clearAuthData();
    return false;
  }
};
