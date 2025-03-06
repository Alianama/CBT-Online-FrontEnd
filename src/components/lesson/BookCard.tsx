"use client"
import {useState} from "react"
import {Card} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import type {BookCardProps} from "@/types/types.ts";

export default function BookCard({
                                     title,
                                     imageUrl,
                                     description,
                                 }: BookCardProps) {
    const [imageError, setImageError] = useState(false)
    const handleImageError = () => {
        setImageError(true)
    }
    return (
        <Card
            className="w-64 p-4 max-md:w-5/5 justify-center shadow-md rounded-xl bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div className="h-40 w-full mb-3">
                <img
                    src={imageError ? "/images/default-book.png" : imageUrl}
                    alt={title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={handleImageError}
                />
            </div>
            <h2 className="text-lg font-bold mb-2 text-sidebar-secondary truncate">{title}</h2>
            <p className="text-sm text-sidebar-secondary mb-4 line-clamp-3">{description}</p>
            <div className="flex justify-between mt-auto">
                <Button

                    className="text-sm text-white bg-primary hover:bg-primary/70 transition-colors rounded-md px-3 py-1"
                >
                    Download
                </Button>
                <Button
                    className="text-sm text-white bg-sidebar-primary hover:bg-sidebar-primary/70 transition-colors rounded-md px-3 py-1">
                    Open
                </Button>
            </div>
        </Card>
    )
}
