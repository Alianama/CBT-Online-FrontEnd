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