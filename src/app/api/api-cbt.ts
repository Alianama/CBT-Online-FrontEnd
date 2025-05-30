import axios from "axios";
import axiosInstance from "@/utils/axiosInstance.ts";

const ALAMAT_API =
  import.meta.env.MODE === "development"
    ? "https://www.emsifa.com/api-wilayah-indonesia/api"
    : "https://www.emsifa.com/api-wilayah-indonesia/api";
const BASE_URL = import.meta.env.VITE_BASE_URL;
export const userAuth = async (token: string) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/auth`,
      { auth_token: token },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
export const getUserById = async (id: number | null) => {
  if (!id || isNaN(id)) {
    console.log(id);
    throw new Error("Invalid user ID");
  }
  try {
    const response = await axiosInstance.get(`${BASE_URL}/siswa/${id}`, {});
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user data"
      );
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
export const getAgenda = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/agenda`, {});
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch agenda data"
      );
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
export const getMapel = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/mapel/siswa`, {});
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch mapel data"
      );
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
export const getMateri = async ({
  id_kelas,
  id_mapel,
}: {
  id_kelas: number;
  id_mapel: number;
}) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/materi`, {
      params: { id_kelas, id_mapel },
      headers: {
        Accept: "application/json",
      },
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch materi data"
      );
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
export const getMateriByID = async (id: number) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/materi`, {
      params: { id },
      headers: {
        Accept: "application/json",
      },
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch materi data"
      );
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
export const getProfil = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/profil`, {});
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch profil data"
      );
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
export const updatePassword = async ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/auth/update-password`,
      { password, confirm_password },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const errorMessage =
        error.response?.data?.message || "Failed to update password";
      throw { status: statusCode, message: errorMessage };
    } else {
      throw { status: 500, message: "An unknown error occurred" };
    }
  }
};
export const addProfil = async ({
  user_id,
  user_type,
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
  motto,
}: {
  user_id?: number;
  user_type?: string;
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
    const response = await axiosInstance.post(`${BASE_URL}/profil`, {
      user_id,
      user_type,
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
      motto,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        status: error.response?.status,
        message: error.response?.data?.message || "Gagal memperbarui profil.",
      };
    } else {
      throw { status: 500, message: "Terjadi kesalahan yang tidak diketahui." };
    }
  }
};
export const updateProfil = async ({
  id_biodata,
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
  motto,
}: {
  id_biodata: number;
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
      `${BASE_URL}/profil/${id_biodata}`,
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
        motto,
      },
      {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        status: error.response?.status,
        message: error.response?.data?.message || "Gagal memperbarui profil.",
      };
    } else {
      throw { status: 500, message: "Terjadi kesalahan yang tidak diketahui." };
    }
  }
};
export const sendOTP = async (no_hp: string) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/auth/send-otp`,
      { phone: no_hp, type: "update" },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to send OTP");
    } else {
      throw new Error("An unknown error occurred while sending OTP");
    }
  }
};
export const verifyOTP = async (no_hp: string, otp: string) => {
  const stringOtp = String(otp);
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/auth/verify-otp`,
      {
        phone: no_hp,
        otp: stringOtp,
        type: "update",
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status;
      const errorMessage =
        error.response?.data?.message || "Failed to verify OTP";
      throw { status: statusCode, message: errorMessage };
    }
  }
};
export const getProvinces = async () => {
  try {
    const response = await axios.get(`${ALAMAT_API}/provinces.json`, {});
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to get provinces."
      );
    }
  }
};
export const getKabKota = async (id: string | undefined) => {
  try {
    const response = await axios.get(`${ALAMAT_API}/regencies/${id}.json`, {});
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to get Kab / Kota."
      );
    }
  }
};
export const getKecamatan = async (id: string | undefined) => {
  try {
    const response = await axios.get(`${ALAMAT_API}/districts/${id}.json`, {});
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to get Kecamatan"
      );
    }
  }
};
export const getKelurahan = async (id: string | undefined) => {
  try {
    const response = await axios.get(`${ALAMAT_API}/villages/${id}.json`, {});
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to get Kelurahan"
      );
    }
  }
};
export const getJadwalList = async () => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/jadwal/ujian`, {});
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to get Jadwal List"
      );
    }
  }
};
export const putProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("profile_img", file);
  try {
    const response = await axiosInstance.patch(
      `${BASE_URL}/profil/upload-img`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Upload gagal:", error);
    throw new Error(
      error?.response?.data?.message || "Gagal upload foto profil"
    );
  }
};
export const postTokenUjian = async (
  token?: string | null,
  id_peserta?: number
) => {
  try {
    const response = await axiosInstance.post(`${BASE_URL}/ujian/start`, {
      token,
      id_peserta,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to post Token Ujian"
      );
    }
  }
};
export const getHasilUjian = async (page: number, limit: number) => {
  try {
    const response = await axiosInstance.get(
      `${BASE_URL}/hasil/siswa?page=${page}&limit=${limit}`,
      {}
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to get Hasil Ujian"
      );
    }
  }
};
export const getHistoriJawaban = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(`${BASE_URL}/hasil/${id}`, {});
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Gagal mengambil Histori Jawaban"
      );
    }
  }
};

export const sendFotoJawaban = async ({
  file,
  token,
  id_soal_ujian,
}: {
  file: File;
  token: string;
  id_soal_ujian: number;
}) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format file harus JPG, JPEG, atau PNG.");
  }

  if (file.size > maxSize) {
    throw new Error("Ukuran file melebihi 5MB.");
  }

  const formData = new FormData();
  formData.append("token", token);
  formData.append("id_soal_ujian", id_soal_ujian.toString());
  formData.append("jawaban", file);

  const response = await axiosInstance.post(
    `${BASE_URL}/ujian/jawab`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const sendLogUjian = async ({
  reason,
  id_peserta,
}: {
  reason: string;
  id_peserta: number;
}) => {
  try {
    const response = await axiosInstance.post(
      `${BASE_URL}/ujian-logs`,
      {
        id_peserta,
        reason,
        time: new Date().toISOString().slice(0, 19).replace("T", " "), // Format: YYYY-MM-DD HH:mm:ss
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Gagal mengirim log ujian"
      );
    } else {
      throw new Error("Terjadi kesalahan yang tidak diketahui");
    }
  }
};
