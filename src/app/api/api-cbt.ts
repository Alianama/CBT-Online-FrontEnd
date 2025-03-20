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
export const getMapel = async (id: number | undefined) => {
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
export const getMateri = async ({id_kelas, id_mapel}: { id_kelas: number; id_mapel: number }) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/materi`, {
            params: {id_kelas, id_mapel},
            headers: {
                Accept: 'application/json',
            }
        })
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch materi data");
        } else {
            throw new Error("An unknown error occurred");
        }
    }
}
export const getMateriByID = async (id: number) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/materi`, {
            params: {id},
            headers: {
                Accept: 'application/json',
            }
        })
        return response.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch materi data");
        } else {
            throw new Error("An unknown error occurred");
        }
    }
}
export const getProfil = async (id: number | undefined) => {
    try {
        const response = await axiosInstance.get(`${BASE_URL}/profil`, {
            params: {user_id: id},
            headers: {
                Accept: 'application/json',
            }
        })
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch profil data");
        } else {
            throw new Error("An unknown error occurred");
        }
    }
}
export const updatePassword = async ({password, confirm_password}: { password: string; confirm_password: string }) => {
    try {
        const response = await axiosInstance.put(`${BASE_URL}/auth/update-password`,
            {password, confirm_password},
            {headers: {"Content-Type": "application/json"}}
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status;
            const errorMessage = error.response?.data?.message || "Failed to update password";
            throw {status: statusCode, message: errorMessage};
        } else {
            throw {status: 500, message: "An unknown error occurred"};
        }
    }
};
export const updateProfil = async ({
                                       id,
                                       tempat_lahir,
                                       tanggal_lahir,
                                       jenis_kelamin,
                                       provinsi,
                                       kota,
                                       kecamatan,
                                       kelurahan,
                                       alamat,
                                       no_hp,
                                       hobi,
                                       cita,
                                       motto
                                   }: {
    id: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    jenis_kelamin: string;
    provinsi: string;
    kota: string;
    kecamatan: string;
    kelurahan: string;
    alamat: string;
    no_hp: string;
    hobi: string;
    cita: string;
    motto: string;
}) => {
    try {
        const response = await axiosInstance.put(
            `${BASE_URL}/profil/${id}`,
            {
                tempat_lahir,
                tanggal_lahir,
                jenis_kelamin,
                provinsi,
                kota,
                kecamatan,
                kelurahan,
                alamat,
                no_hp,
                hobi,
                cita,
                motto
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status;
            const errorMessage = error.response?.data?.message || "Failed to update profile";
            throw {status: statusCode, message: errorMessage};
        } else {
            throw {status: 500, message: "An unknown error occurred"};
        }
    }
};