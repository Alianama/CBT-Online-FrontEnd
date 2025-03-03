export interface Event {
    id: string
    title: string
    date: string
    time: string
    location?: string
    description?: string
    category: "work" | "personal" | "other"
}

