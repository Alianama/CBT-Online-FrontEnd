import type {Event} from "@/types/types.ts";

export const sampleEvents: Event[] = [
    {
        id: "1",
        title: "Team Meeting",
        description: "Weekly team sync",
        startDate: new Date(2025, 2, 5),
        endDate: new Date(2025, 2, 6),
        color: "bg-blue-200 hover:bg-blue-300 dark:bg-blue-800 dark:hover:bg-blue-700",
    },
    {
        id: "2",
        title: "Product Launch",
        description: "New product release",
        startDate: new Date(2025, 2, 10),
        endDate: new Date(2025, 2, 10),
        color: "bg-green-200 hover:bg-green-300 dark:bg-green-800 dark:hover:bg-green-700",
    },
    {
        id: "3",
        title: "Conference",
        description: "Annual industry conference",
        startDate: new Date(2025, 2, 15),
        endDate: new Date(2025, 2, 18),
        color: "bg-purple-200 hover:bg-purple-300 dark:bg-purple-800 dark:hover:bg-purple-700",
    },
    {
        id: "4",
        title: "Vacation",
        description: "Team building retreat",
        startDate: new Date(2025, 2, 22),
        endDate: new Date(2025, 2, 26),
        color: "bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-800 dark:hover:bg-yellow-700",
    },
    {
        id: "5",
        title: "Client Meeting",
        description: "Quarterly review with client",
        startDate: new Date(2025, 3, 2),
        endDate: new Date(2025, 3, 2),
        color: "bg-red-200 hover:bg-red-300 dark:bg-red-800 dark:hover:bg-red-700",
    },
    {
        id: "6",
        title: "Training Workshop",
        description: "New skills development",
        startDate: new Date(2025, 3, 8),
        endDate: new Date(2025, 3, 10),
        color: "bg-indigo-200 hover:bg-indigo-300 dark:bg-indigo-800 dark:hover:bg-indigo-700",
    },
]