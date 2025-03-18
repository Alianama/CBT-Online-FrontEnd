export interface Agenda {
    id?: number;
    semester: number
    title: string
    date_started: string
    date_ended: string
    color: string
}

export interface AgendaResponse {
    total: number;
    data: Agenda[];
}

export interface User {
    username: string
    password: string
}

export interface Question {
    id: number
    text: string
    options: { id: string; text: string }[]
    correctAnswer: string
}

export interface BookCardProps {
    id: number;
    category: string;
    title: string
    imageUrl?: string
    description: string
    openUrl?: string
    downloadUrl?: string
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
    user_type: number;
    id_kelas: number;
    nama: string;
    nis: string;
    ban: number;
    username: string;
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

export interface MapelResponse {
    total: number;
    data: Mapel[];
}

export interface LessonProps {
    data: MapelResponse | undefined;
    error?: Error | null;
    isLoading: boolean;
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