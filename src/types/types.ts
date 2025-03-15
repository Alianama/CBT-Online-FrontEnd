

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

export interface Mapel {
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
  materials: number,
  bgImage?: string | undefined,
}