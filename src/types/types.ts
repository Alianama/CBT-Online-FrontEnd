export interface Agenda {
    id?: number;
    semester: number
    title: string
    date_started: string
    date_ended: string
    color: string
}

export interface Question {
    id: number
    text: string
    options: { id: string; text: string }[]
    correctAnswer: string
}

export interface Token {
    token: string;
    expired_at: number;
}

export interface UserData {
    angkatan: string;
    nama_kelas: string;
    nama_siswa: string;
    picture: string;
    user_id: number;
    user_type: string;
    id_kelas: number;
    nama: string;
    nis: string;
    ban: number;
    username: string;
}

export interface Profil {
    id_biodata: number;
    user_id: number;
    user_type: string;
    tempat_lahir: string
    tanggal_lahir: string
    jenis_kelamin: string
    provinsi: string
    kota: string
    kecamatan: string
    kelurahan: string
    alamat: string
    no_hp: string
    hobi: string
    cita: string
    motto: string
}

export interface Mapel {
    total_materi: number;
    materials: number;
    id_mapel: number;
    kode_mapel: string;
    nama_mapel: string;
    icon: string;
    status: number;
    id_kelas: number;
    nama_kelas: string;
    id_angkatan: number;
    angkatan: string;
}

export interface SubjectCardProps {
    title: string,
    mapel_code: string,
    bgImage?: string | undefined,
    total_materi: number | undefined,
    id_mapel?: number
    id_kelas?: number
}

export interface Materi {
    size: string
    id_materi: number,
    title: string,
    content: string,
    level: string,
    time_created: string,
    date: string,
    tipe_materi: string,
    attachment: string,
}

export interface materiCard {
    materi: Materi;
    subject?: string | undefined;
    idKelas?: string;
    idMapel?: string;
}