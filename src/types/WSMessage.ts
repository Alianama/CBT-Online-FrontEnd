// Tipe untuk pesan autentikasi yang dikirim dari client
export type AuthMessage = {
    type: "auth";
    token: string;
};

// Tipe untuk response sukses autentikasi
export type AuthSuccessMessage = {
    type: "auth-success";
};

// Tipe untuk response gagal autentikasi
export type AuthFailedMessage = {
    type: "auth-failed";
    error?: string;
};

// Tipe untuk request info ujian
export type InfoUjianRequestMessage = {
    type: "info-ujian";
    payload: {
        id_peserta: number;
        id_bank: number;
        status_ujian: number;
        kode_bank: string;
    };
};

// Tipe untuk response info ujian dari server
export type InfoUjianMessage = {
    type: "info-ujian";
    payload: {
        nama_peserta: string;
        durasi: number;
        jumlah_soal: number;
        nama_ujian: string;
        waktu_mulai: string;
        waktu_selesai: string;
    };
};

// Tipe untuk request soal dari client
export type SoalRequestMessage = {
    type: "soal";
};

// Tipe untuk response soal dari server
export type SoalMessage = {
    type: "soal";
    payload: {
        id_soal: number;
        soal: string;
        opsi: {
            A: string;
            B: string;
            C: string;
            D: string;
        };
        jawaban?: string; // hanya kalau admin
    };
};

// Tipe error dari server
export type ErrorMessage = {
    type: "error";
    error: string;
};

// Gabungan semua tipe message yang mungkin diterima dari server
export type WSMessage =
    | AuthSuccessMessage
    | AuthFailedMessage
    | InfoUjianMessage
    | SoalMessage
    | ErrorMessage;
