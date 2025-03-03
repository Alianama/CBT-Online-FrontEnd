import {CalendarEvent} from '@/components/calendar/calendar-types'
import {addDays, startOfMonth} from 'date-fns'
import {colorOptions} from '@/components/calendar/calendar-tailwind-classes'

const EVENT_TITLES = [
    'Team Standup',
    'Project Review',
    'Client Meeting',
    'Design Workshop',
    'Code Review',
    'Sprint Planning',
    'Product Demo',
    'Architecture Discussion',
    'User Testing',
    'Stakeholder Update',
    'Tech Talk',
    'Deployment Planning',
    'Bug Triage',
    'Feature Planning',
    'Team Training',
]
// Extract color values from colorOptions
const EVENT_COLORS = colorOptions.map((color) => color.value)

function getRandomTime(date: Date): Date {
    const hours = Math.floor(Math.random() * 14) + 8 // 8 AM to 10 PM
    const minutes = Math.floor(Math.random() * 4) * 15 // 0, 15, 30, 45
    return new Date(date.setHours(hours, minutes, 0, 0))
}

function generateEventDuration(): number {
    const durations = [30, 60, 90, 120] // in minutes
    return durations[Math.floor(Math.random() * durations.length)]
}

export function generateMockEvents(): CalendarEvent[] {
    const events: CalendarEvent[] = []
    const startDate = startOfMonth(new Date())
    // Generate 120 events over 3 months
    for (let i = 0; i < 120; i++) {
        // Random date between start and end
        const daysToAdd = Math.floor(Math.random() * 90) // 90 days = ~3 months
        const eventDate = addDays(startDate, daysToAdd)
        const startTime = getRandomTime(eventDate)
        const durationMinutes = generateEventDuration()
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000)
        events.push({
            id: `event-${i + 1}`,
            title: EVENT_TITLES[Math.floor(Math.random() * EVENT_TITLES.length)],
            color: EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)],
            start: startTime,
            end: endTime,
        })
    }
    // Sort events by start date
    return events.sort((a, b) => a.start.getTime() - b.start.getTime())
}

// import {CalendarEvent} from '@/components/calendar/calendar-types'
// import {colorOptions} from '@/components/calendar/calendar-tailwind-classes'
// // Extract color values from colorOptions
// const EVENT_COLORS = colorOptions.map((color) => color.value)
// // Data event statis untuk Maret 2025
// const staticEvents: CalendarEvent[] = [
//     {
//         id: 'event-1',
//         title: 'Kick-off Meeting',
//         color: EVENT_COLORS[0],
//         start: new Date('2025-03-01T09:00:00'),
//         end: new Date('2025-03-05T10:30:00'),
//     },
//     {
//         id: 'event-2',
//         title: 'Code Review Session',
//         color: EVENT_COLORS[1],
//         start: new Date('2025-03-03T14:00:00'),
//         end: new Date('2025-03-03T15:00:00'),
//     },
//     {
//         id: 'event-3',
//         title: 'Design Review',
//         color: EVENT_COLORS[2],
//         start: new Date('2025-03-05T11:00:00'),
//         end: new Date('2025-03-05T12:00:00'),
//     },
//     {
//         id: 'event-4',
//         title: 'Sprint Planning',
//         color: EVENT_COLORS[3],
//         start: new Date('2025-03-08T10:00:00'),
//         end: new Date('2025-03-08T11:30:00'),
//     },
//     {
//         id: 'event-5',
//         title: 'Tech Workshop',
//         color: EVENT_COLORS[4],
//         start: new Date('2025-03-10T13:00:00'),
//         end: new Date('2025-03-10T15:00:00'),
//     },
//     {
//         id: 'event-6',
//         title: 'Client Presentation',
//         color: EVENT_COLORS[5],
//         start: new Date('2025-03-15T16:00:00'),
//         end: new Date('2025-03-15T17:00:00'),
//     },
//     {
//         id: 'event-7',
//         title: 'Team Retrospective',
//         color: EVENT_COLORS[6],
//         start: new Date('2025-03-20T09:00:00'),
//         end: new Date('2025-03-20T10:30:00'),
//     },
//     {
//         id: 'event-8',
//         title: 'Security Audit',
//         color: EVENT_COLORS[7],
//         start: new Date('2025-03-25T11:00:00'),
//         end: new Date('2025-03-25T12:30:00'),
//     },
//     {
//         id: 'event-9',
//         title: 'Product Launch',
//         color: EVENT_COLORS[8],
//         start: new Date('2025-03-28T14:00:00'),
//         end: new Date('2025-03-28T16:00:00'),
//     },
//     {
//         id: 'event-10',
//         title: 'End of Month Review',
//         color: EVENT_COLORS[9],
//         start: new Date('2025-03-31T15:00:00'),
//         end: new Date('2025-03-31T16:00:00'),
//     },
// ]
//
// export function generateMockEvents(): CalendarEvent[] {
//     // Mengurutkan event berdasarkan tanggal mulai
//     return staticEvents.sort((a, b) => a.start.getTime() - b.start.getTime())
// }
