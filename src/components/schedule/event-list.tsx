"use client"
import {useContext, useMemo} from "react"
import type {Event} from "@/types/event"
import {formatDate} from "@/lib/utils"
import LangContext from "@/context/LangContext.tsx";

interface EventListProps {
    currentDate: Date
    events: Event[]
}

export function EventList({currentDate, events}: EventListProps) {
    const monthEvents = useMemo(() => {
        return events
            .filter((event) => {
                const eventStart = new Date(event.startDate)
                const eventEnd = new Date(event.endDate)
                const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
                const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
                return (
                    (eventStart >= monthStart && eventStart <= monthEnd) ||
                    (eventEnd >= monthStart && eventEnd <= monthEnd) ||
                    (eventStart <= monthStart && eventEnd >= monthEnd)
                )
            })
            .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    }, [currentDate, events])
    const {locale} = useContext(LangContext)
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">{locale === "id" ? "Jawdal" : "Schedule"}</h2>

            {monthEvents.length === 0 ? (
                <p className="text-muted-foreground">{locale === "id" ? "Tidak ada jadwal bulan ini" : "No schedule this month"}</p>
            ) : (
                <div className="space-y-3">
                    {monthEvents.map((event) => (
                        <div key={event.id} className="border rounded-md p-3 space-y-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${event.color.split(" ")[0]}`}/>
                                <h3 className="font-medium">{event.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                            <div className="text-xs text-muted-foreground">
                                {formatDate(event.startDate)}
                                {event.startDate.getTime() !== event.endDate.getTime() && ` - ${formatDate(event.endDate)}`}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

