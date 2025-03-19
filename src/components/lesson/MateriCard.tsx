"use client"
import {Clock, Download, FileText} from "lucide-react"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../ui/card";
import {Button} from "@/components/ui/button.tsx";
import {Materi} from "@/types/types.ts";
import {DocumentLink} from "@/components/lesson/viewer/document-link.tsx";
import {Link} from "react-router-dom"

const VITE_ASSET_DOMAIN = import.meta.env.VITE_ASSET_DOMAIN;

interface materiCard {
    materi: Materi,
    subject?: string | undefined
    idKelas?: string
    idMapel?: string
}

export default function MateriCard({materi, subject, idKelas, idMapel}: materiCard) {
    const atachment_URL = materi.attachment?.replace(/\{\{DOMAIN}}/g, VITE_ASSET_DOMAIN);
    return (
        <Card>
            <CardHeader className="pb-2 px-3 pt-3 sm:px-6 sm:pt-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                        <CardTitle className="text-lg sm:text-xl">{materi.title}</CardTitle>
                        <CardDescription> Size: {materi.size}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Dasar</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">

                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4"/>
                            <span>{materi.time_created}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <FileText className="h-5 w-5"/>
                            <span className="uppercase">{materi.tipe_materi}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            to={
                                materi.tipe_materi === "zip" || materi.tipe_materi === "text"
                                    ? "#"
                                    : `/lesson/${subject}/${idKelas}/${idMapel}/materi/${materi.tipe_materi}/${encodeURIComponent(atachment_URL)}`
                            }
                            onClick={(e) => {
                                if (materi.tipe_materi === "zip" || materi.tipe_materi === "text") {
                                    e.preventDefault();
                                }
                            }}
                        >
                            <Button disabled={materi.tipe_materi === "zip" || materi.tipe_materi === "text"}>
                                <FileText/> Open
                            </Button>
                        </Link>

                        <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none">
                            <DocumentLink fileUrl={atachment_URL} fileName={materi.title}
                                          fileType={materi.tipe_materi}/>
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => {
                                const link = document.createElement("a");
                                link.href = atachment_URL;
                                link.target = "_blank";
                                link.download = "";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            className="flex-1 sm:flex-none"
                        >
                            <Download className="h-4 w-4 mr-2"/>
                            Download
                        </Button>

                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
