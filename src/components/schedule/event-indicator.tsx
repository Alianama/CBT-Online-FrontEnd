"use client"
import {cn} from "@/lib/utils"
import type {Event} from "@/types/types"

interface EventIndicatorProps {
    event: Event
    isRangeStart: boolean
    isRangeEnd: boolean
    isInRange: boolean
}

export function EventIndicator({event, isRangeStart, isRangeEnd, isInRange}: EventIndicatorProps) {
    const isMultiDay = event.startDate.getTime() !== event.endDate.getTime()
    return (
        <div
            className={cn(
                "text-xs p-2 rounded-sm truncate cursor-pointer transition-colors min-h-[30px]",
                event.color,
                isMultiDay && isRangeStart && "rounded-r-none",
                isMultiDay && isRangeEnd && "rounded-l-none",
                isMultiDay && isInRange && "rounded-none",
            )}
            title={`${event.title}: ${event.description}`}
        >
            {(isRangeStart || !isMultiDay) && event.title}
            {isInRange && !isRangeStart && !isRangeEnd && ""}
        </div>
    )
}

