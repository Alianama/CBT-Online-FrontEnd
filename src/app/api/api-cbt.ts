import axios from 'axios';
import axiosInstance from "@/utils/axiosInstance.ts";

const BASE_URL = import.meta.env.VITE_BASE_URL;
export const userAuth = async (token: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth`, {token}, {
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
export const getUserById = async (id: number) => {
    try {
        const response = await axiosInstance.post(`${BASE_URL}/siswa`, {id});
        console.log(response);
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}
