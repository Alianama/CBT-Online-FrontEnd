
import { useEffect } from "react"
import { Clock } from "lucide-react"

interface TimerProps {
    timeLeft: number
    setTimeLeft: (time: (prev: number) => (number)) => void
    onTimeUp: () => void
}

export default function Timer({ timeLeft, setTimeLeft, onTimeUp }: TimerProps) {
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    onTimeUp()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [setTimeLeft, onTimeUp])

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <div className="flex items-center gap-2 text-sm font-medium">
            <Clock className="h-4 w-4" />
            <span className={timeLeft < 300 ? "text-red-500" : ""}>{formatTime(timeLeft)}</span>
        </div>
    )
}
