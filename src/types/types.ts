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