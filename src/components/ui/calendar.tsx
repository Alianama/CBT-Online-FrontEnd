"use client";
import {useContext, useEffect, useState} from "react";
import {cn} from "@/lib/utils";
import type {Event} from "@/types/event";
import {EventIndicator} from "@/components/schedule/event-indicator";
import LangContext from "@/context/LangContext.tsx";

interface CalendarProps {
    currentDate: Date;
    events: Event[];
}

export function Calendar({currentDate, events}: CalendarProps) {
    const [calendarDays, setCalendarDays] = useState<Date[]>([]);
    const {locale} = useContext(LangContext);
    const weekDays =
        locale === "id"
            ? ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
            : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    useEffect(() => {
        const days: Date[] = [];
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const firstDayOfWeek = firstDayOfMonth.getDay();
        const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            days.push(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthLastDay - i));
        }
        // Add all days of the current month
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        }
        // Add next month's days to complete the last week
        const remainingDays = 7 - (days.length % 7);
        if (remainingDays < 7) {
            for (let i = 1; i <= remainingDays; i++) {
                days.push(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i));
            }
        }
        setCalendarDays(days);
    }, [currentDate]);
    const isSameDate = (date1: Date, date2: Date) =>
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear();
    const isCurrentMonth = (date: Date) => date.getMonth() === currentDate.getMonth();
    const isToday = (date: Date) => isSameDate(date, new Date());
    const getEventsForDate = (date: Date) => {
        return events.filter((event) => {
            const eventStart = new Date(event.startDate);
            const eventEnd = new Date(event.endDate);
            const dateToCheck = new Date(date).setHours(0, 0, 0, 0);
            return dateToCheck >= eventStart.setHours(0, 0, 0, 0) && dateToCheck <= eventEnd.setHours(0, 0, 0, 0);
        });
    };
    const isRangeBoundary = (date: Date, event: Event, type: "start" | "end") => {
        const eventDate = new Date(type === "start" ? event.startDate : event.endDate);
        return isSameDate(date, eventDate);
    };
    const isInRange = (date: Date, event: Event) => {
        const dateToCheck = new Date(date).setHours(0, 0, 0, 0);
        const start = new Date(event.startDate).setHours(0, 0, 0, 0);
        const end = new Date(event.endDate).setHours(0, 0, 0, 0);
        return dateToCheck > start && dateToCheck < end;
    };
    return (
        <div className="w-full">
            <div className="grid grid-cols-7 gap-px">
                {weekDays.map((day, index) => (
                    <div key={index} className="p-2 text-center font-medium text-muted-foreground">
                        {day}
                    </div>
                ))}

                {calendarDays.map((day, index) => {
                    const dayEvents = getEventsForDate(day);
                    return (
                        <div
                            key={index}
                            className={cn(
                                "min-h-[100px] p-1 border border-border relative",
                                !isCurrentMonth(day) && "bg-muted/30",
                                isToday(day) && "bg-muted/50"
                            )}
                        >
                            <div
                                className={cn(
                                    "text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full",
                                    isToday(day) && "bg-primary text-primary-foreground"
                                )}
                            >
                                {day.getDate()}
                            </div>

                            <div className="mt-1 space-y-1 max-h-[80px] overflow-y-auto">
                                {dayEvents.map((event) => (
                                    <EventIndicator
                                        key={event.id}
                                        event={event}
                                        isRangeStart={isRangeBoundary(day, event, "start")}
                                        isRangeEnd={isRangeBoundary(day, event, "end")}
                                        isInRange={isInRange(day, event)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
