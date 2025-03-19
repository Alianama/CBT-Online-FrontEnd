"use client";
import {cn} from "@/lib/utils";
import type {Agenda} from "@/types/types";
import {hexToRGBA} from "@/utils/rgbConverter.ts"

interface EventIndicatorProps {
    event: Agenda;
    isRangeStart: boolean;
    isRangeEnd: boolean;
    isInRange: boolean;
}

export function EventIndicator({event, isRangeStart, isRangeEnd, isInRange}: EventIndicatorProps) {
    const startDate = new Date(event.date_started);
    const endDate = new Date(event.date_ended);
    const isMultiDay = startDate.getTime() !== endDate.getTime();
    return (
        <div
            className={cn(
                "text-xs p-2 rounded-sm truncate cursor-pointer transition-colors min-h-[30px] text-white",
                isMultiDay && isRangeStart && "rounded-r-none",
                isMultiDay && isRangeEnd && "rounded-l-none",
                isMultiDay && isInRange && "rounded-none"
            )}
            style={{backgroundColor: hexToRGBA(event.color, 0.7)}}
            title={`${event.title}: ${event.semester}`}
        >
            {(isRangeStart || !isMultiDay) && event.title}
            {isInRange && !isRangeStart && !isRangeEnd && ""}
        </div>
    );
}
