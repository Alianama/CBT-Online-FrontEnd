import axios from 'axios';
import axiosInstance from "@/utils/axiosInstance.ts";

const BASE_URL = import.meta.env.VITE_BASE_URL;
export const userAuth = async (token: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth`, {auth_token: token}, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};
export const getUserById = async (id: number | null) => {
    if (!id || isNaN(id)) {
        console.log(id)
        throw new Error("Invalid user ID");
    }
    try {
        const response = await axiosInstance.get(`${BASE_URL}/siswa/${id}`, {});
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch user data");
        } else {
            throw new Error("An unknown error occurred");
        }
    }
};
export const getAgenda = async () => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/agenda`, {})
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch agenda data");
        } else {
            throw new Error("An unknown error occurred");
        }
    }
}


export const getMapel = async (id: number | undefined  ) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/mapel?id_kelas=${id}`, {})
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch mapel data");
        } else {
            throw new Error("An unknown error occurred");
        }
    }
}