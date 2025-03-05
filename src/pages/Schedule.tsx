"use client"
import {useContext, useEffect, useState} from "react"
import {Calendar} from "@/components/ui/calendar"
import {EventList} from "@/components/schedule/event-list"
import {CalendarHeader} from "@/components/schedule/calendar-header"
import type {Event} from "@/types/event"
import Layout from "@/components/sidebar/Layout.tsx";
import LangContext from "@/context/LangContext.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";

const sampleEvents: Event[] = [
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
export default function SchedulePage() {
    const [currentDate, setCurrentDate] = useState<Date>(new Date())
    const [events, setEvents] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response: Event[] = await new Promise((resolve) =>
                    setTimeout(() => resolve(sampleEvents), 1000)
                );
                setEvents(response);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    }
    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    }
    const handleToday = () => {
        setCurrentDate(new Date())
    }
    const {locale} = useContext(LangContext)
    const pageData = {
        id: {
            name: "Jadwal",
            url: "/schedule",
        },
        en: {
            name: "Schedule",
            url: "/schedule",
        }
    }
    if (isLoading) {
        return (
            <Layout data={locale === "id" ? [pageData.id] : [pageData.en]}>
                <title>Home</title>
                <div className="flex w-full h-screen gap-4 p-4 pt-0">
                    <div className="w-full pt-20 gap-5 max-md:flex-col flex">
                        <Skeleton className="w-[75%] h-[100%] max-md:w-[100%] max-md:h-[50%]  rounded-20"/>
                        <Skeleton className="w-[25%] h-[100%] max-md:w-[100%] max-md:h-[50%] rounded-20"/>
                    </div>
                </div>
            </Layout>
        )
    } else {
        return (
            <Layout data={locale === "id" ? [pageData.id] : [pageData.en]}>
                <title>Home</title>
                <div className="flex flex-col min-h-screen">
                    <CalendarHeader
                        currentDate={currentDate}
                        onPrevMonth={handlePrevMonth}
                        onNextMonth={handleNextMonth}
                        onToday={handleToday}
                    />
                    <div className="flex flex-col md:flex-row flex-1 gap-4 p-4">
                        <div className="md:w-3/4 bg-card rounded-lg shadow-sm border">
                            <Calendar currentDate={currentDate} events={events}/>
                        </div>
                        <div className="md:w-1/4 bg-card rounded-lg shadow-sm border p-4">
                            <EventList currentDate={currentDate} events={events}/>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }
}

