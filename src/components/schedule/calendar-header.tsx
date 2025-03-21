"use client"
import {ChevronLeft, ChevronRight} from "lucide-react"
import {Button} from "@/components/ui/button"

interface CalendarHeaderProps {
    currentDate: Date
    onPrevMonth: () => void
    onNextMonth: () => void
    onToday: () => void
}

export function CalendarHeader({currentDate, onPrevMonth, onNextMonth, onToday}: CalendarHeaderProps) {
    const monthNames: string[] = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]
    return (
        <header className="bg-card border-b p-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onToday}>
                    Today
                </Button>
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" onClick={onPrevMonth}>
                        <ChevronLeft className="h-4 w-4"/>
                        <span className="sr-only">Previous month</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={onNextMonth}>
                        <ChevronRight className="h-4 w-4"/>
                        <span className="sr-only">Next month</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}

