"use client"
import {useContext, useMemo} from "react"
import type {Event} from "@/types/types"
import {formatDate} from "@/lib/utils"
import LangContext from "@/context/LangContext.tsx";

interface EventListProps {
    currentDate: Date
    events: Event[]
}

export function EventList({currentDate, events}: EventListProps) {
    const monthEvents = useMemo(() => {
        return events
            .map(event => ({
                ...event,
                date_started: new Date(event.date_started),
                date_ended: new Date(event.date_ended),
            }))
            .filter(event => {
                const eventStart = event.date_started;
                const eventEnd = event.date_ended;
                const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                return (
                    (eventStart >= monthStart && eventStart <= monthEnd) ||
                    (eventEnd >= monthStart && eventEnd <= monthEnd) ||
                    (eventStart <= monthStart && eventEnd >= monthEnd)
                );
            })
            .sort((a, b) => a.date_started.getTime() - b.date_started.getTime());
    }, [currentDate, events]);
    const {locale} = useContext(LangContext);
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Agenda</h2>

            {monthEvents.length === 0 ? (
                <p className="text-muted-foreground">
                    {locale === "id" ? "Tidak ada jadwal bulan ini" : "No schedule this month"}
                </p>
            ) : (
                <div className="space-y-3">
                    {monthEvents.map(event => (
                        <div key={event.id} className="border rounded-md p-3 space-y-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{backgroundColor: event.color}}
                                />
                                <h3 className="font-medium">{event.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {locale === "id" ? `Semester ${event.semester}` : `Semester ${event.semester}`}
                            </p>
                            <div className="text-xs text-muted-foreground">
                                {formatDate(event.date_started)}
                                {event.date_started.getTime() !== event.date_ended.getTime() &&
                                    ` - ${formatDate(event.date_ended)}`}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}