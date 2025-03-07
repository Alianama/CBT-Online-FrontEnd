"use client"
import {useContext, useEffect, useState} from "react"
import {Calendar} from "@/components/ui/calendar"
import {EventList} from "@/components/schedule/event-list"
import {CalendarHeader} from "@/components/schedule/calendar-header"
import type {Event} from "@/types/types"
import Layout from "@/components/sidebar/Layout.tsx";
import LangContext from "@/context/LangContext.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {getEvents} from "@/app/api/api.ts";

export default function SchedulePage() {
    const [currentDate, setCurrentDate] = useState<Date>(new Date())
    const [events, setEvents] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const data = await getEvents();
                setEvents(data);
                setError(null);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : "Failed to get Event data";
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        })();
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
    if (error) {
        return (
            <div>
                <h1>{error}</h1>
            </div>
        )
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

