export interface Event {
    id: string
    title: string
    description: string
    startDate: Date
    endDate: Date
    color: string
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

export interface SearchInputProps {
    onSearch: (query: string) => void;
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
    user_id: number;
    user_type: number;
    id_kelas: number;
    nama_siswa: string;
    nis: string;
    ban: number;
    username: string;
}   