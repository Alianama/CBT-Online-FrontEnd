"use client"
import {Link, useParams} from "react-router-dom"
import {Button} from "@/components/ui/button.tsx"
import {Card, CardContent} from "@/components/ui/card.tsx"
import {ArrowLeft, Clock, Download, FileText, Share2} from "lucide-react"

export default function DocumentOpen() {
    const {subject, material} = useParams<{ subject: string; material: string }>()
    // In a real app, you would fetch this data from an API or database
    const materialData = {
        id: material,
        title: "Pengenalan Dasar",
        description: "Materi dasar untuk pemula",
        content: `
      <h2>Pengenalan Dasar</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc, quis aliquam nisl nunc quis nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc quis nisl.</p>
      <h3>Bagian 1</h3>
      <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>
      <h3>Bagian 2</h3>
      <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    `,
        type: "pdf",
        level: "dasar",
        duration: "30 menit",
        date: "2023-01-15",
        author: "Dr. Budi Santoso",
    }
    // const subjectTitle = subject ? subject.charAt(0).toUpperCase() + subject.slice(1).replace("-", " ") : ""
    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
            <div className="mb-6">
                <Link
                    to={`/subjects/${subject}`}
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="mr-1 h-4 w-4"/>
                    Kembali
                </Link>

                <div className="flex flex-col gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{materialData.title}</h1>
                        <p className="text-muted-foreground">{materialData.description}</p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4"/>
                                <span>{materialData.duration}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <FileText className="h-4 w-4"/>
                                <span className="uppercase">{materialData.type}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">Oleh: {materialData.author}</div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                            <Share2 className="h-4 w-4 mr-2"/>
                            Bagikan
                        </Button>
                        <Button size="sm" className="flex-1 sm:flex-none">
                            <Download className="h-4 w-4 mr-2"/>
                            Unduh
                        </Button>
                    </div>
                </div>
            </div>

            <Card className="mb-8">
                <CardContent className="p-3 sm:p-6">
                    <div
                        className="prose max-w-none text-sm sm:text-base"
                        dangerouslySetInnerHTML={{__html: materialData.content}}
                    />
                </CardContent>
            </Card>

            <div className="flex justify-between items-center gap-2">
                <Button variant="outline" className="flex-1">
                    Sebelumnya
                </Button>
                <Button className="flex-1">Selanjutnya</Button>
            </div>
        </div>
    )
}

