// "use client"
// import {Link, useParams} from "react-router-dom"
// import {ArrowLeft, BookOpen, Clock, Download} from "lucide-react"
// import Layout from "@/components/sidebar/Layout.tsx";
// import {useContext} from "react";
// import LangContext from "@/context/LangContext.tsx";
// import {Input} from "@/components/ui/input.tsx";
// import {useQuery} from "@tanstack/react-query";
// import {getMateri} from "@/app/api/api-cbt.ts";
// import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../ui/card";
// import {Button} from "@/components/ui/button.tsx";
//
// export default function SubjectPage() {
//     const {subject, idKelas, idMapel} = useParams<{ subject: string; idKelas: string; idMapel: string }>();
//     const id_kelas = idKelas ? parseInt(idKelas, 10) : undefined;
//     const id_mapel = idMapel ? parseInt(idMapel, 10) : undefined;
//     const subjectMap: Record<string, { title: string; description: string; color: string }> = {
//         ipa: {
//             title: "IPA",
//             description: "Ilmu Pengetahuan Alam",
//             color: "bg-blue-100",
//         },
//         ips: {
//             title: "IPS",
//             description: "Ilmu Pengetahuan Sosial",
//             color: "bg-green-100",
//         },
//         matematika: {
//             title: "Matematika",
//             description: "Aljabar, Geometri, Statistik",
//             color: "bg-purple-100",
//         },
//         // Add other subjects here
//     }
//     const currentSubject = subject
//         ? subjectMap[subject] || {
//         title: subject.charAt(0).toUpperCase() + subject.slice(1).replace("-", " "),
//         description: "Materi Pembelajaran",
//         color: "bg-gray-100",
//     }
//         : {title: "", description: "", color: ""}
//     const {data, isLoading, error} = useQuery({
//         queryKey: ["Materi", id_kelas, id_mapel],
//         queryFn: () => {
//             if (id_kelas === undefined || id_mapel === undefined) {
//                 return Promise.reject(new Error("kelasId atau mapelId tidak valid"));
//             }
//             return getMateri({id_kelas, id_mapel});
//         },
//         staleTime: 10 * 60 * 1000,
//         enabled: !!id_kelas && !!id_mapel,
//         refetchOnWindowFocus: true,
//         retry: 1,
//     });
//     console.log("🔹 id_kelas:", id_kelas);
//     console.log("🔹 id_mapel:", id_mapel);
//     console.log("🔹 Data:", data);
//     const {locale} = useContext(LangContext);
//     const safeLocale = (locale === "id" || locale === "en") ? locale : "en";
//     const pageData: Record<"id" | "en", { name: string; url: string }[]> = {
//         id: [
//             {name: "Materi", url: "/lesson"},
//             {name: "Buku Materi", url: "#"}
//         ],
//         en: [
//             {name: "Lesson", url: "/lesson"},
//             {name: "Lesson Book", url: "/lesson"}
//         ]
//     };
//     return (
//         <Layout data={pageData[safeLocale]}>
//             <div className="container mx-auto py-6 px-4 md:px-6">
//                 <div className="mb-6">
//                     <Link
//                         to="/lesson"
//                         className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4">
//                         <ArrowLeft className="mr-1 h-4 w-4"/>
//                         {locale === "id" ? "Kembali" : "Back"}
//                     </Link>
//
//                     <div className="flex flex-col gap-4">
//                         <div className="flex items-start gap-3">
//                             <div
//                                 className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center ${currentSubject.color}`}
//                             >
//                                 <BookOpen className="h-6 w-6 sm:h-8 sm:w-8"/>
//                             </div>
//                             <div>
//                                 <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{currentSubject.title}</h1>
//                                 <p className="text-muted-foreground">{currentSubject.description}</p>
//                             </div>
//                         </div>
//                         <Input placeholder={locale === "id" ? "Cari Materi Pembelajaran" : "Search Lesson Books"}/>
//                     </div>
//                 </div>
//
//
//                 <div className="grid gap-4">
//                     {data
//                         .map((materi: Materi) => (
//                             <MateriCard key={materi.id} materi={materi}/>
//                         ))}
//                 </div>
//             </div>
//         </Layout>
//     )
// }
//
// interface Materi {
//     id: number
//     title: string
//     content: string
//     level: string
//     time_created: string
//     date: string
//     tipe_materi: string
// }
//
// interface MaterialCardProps {
//     materi: Materi
// }
//
// function MateriCard({materi,}: MaterialCardProps) {
//     // const getTypeIcon = (type: string) => {
//     //     switch (type) {
//     //         case "pdf":
//     //             return <FileText className="h-5 w-5"/>
//     //         case "video":
//     //             return <BookOpen className="h-5 w-5"/>
//     //         default:
//     //             return <FileText className="h-5 w-5"/>
//     //     }
//     // }
//     // const getLevelBadge = (level: string) => {
//     //     switch (level) {
//     //         case "dasar":
//     //             return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Dasar</span>
//     //         case "menengah":
//     //             return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Menengah</span>
//     //         case "lanjutan":
//     //             return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Lanjutan</span>
//     //         default:
//     //             return null
//     //     }
//     // }
//     return (
//         <Card>
//             <CardHeader className="pb-2 px-3 pt-3 sm:px-6 sm:pt-6">
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
//                     <div>
//                         <CardTitle className="text-lg sm:text-xl">{materi.title}</CardTitle>
//                         <CardDescription>{materi.content}</CardDescription>
//                     </div>
//                     {/*<div className="flex items-center gap-2">{getLevelBadge(materi.level)}</div>*/}
//                 </div>
//             </CardHeader>
//             <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
//                 <div className="flex flex-col gap-4">
//                     <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
//                         <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                             <Clock className="h-4 w-4"/>
//                             <span>{materi.time_created}</span>
//                         </div>
//                         <div className="flex items-center gap-1 text-sm text-muted-foreground">
//                             {/*{getTypeIcon(materi.tipe_materi)}*/}
//                             <span className="uppercase">{materi.tipe_materi}</span>
//                         </div>
//                     </div>
//                     <div className="flex gap-2">
//                         <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
//                             {/*<Link to={`/subjects/${subjectSlug}/${material.id}`} className="w-full flex justify-center">*/}
//                             {/*    Lihat*/}
//                             {/*</Link>*/}
//                         </Button>
//                         <Button size="sm" className="flex-1 sm:flex-none">
//                             <Download className="h-4 w-4 mr-2"/>
//                             Unduh
//                         </Button>
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }
//
"use client"
import {Link, useParams} from "react-router-dom"
import {ArrowLeft, BookOpen, Clock, Download, FileText} from "lucide-react"
import Layout from "@/components/sidebar/Layout.tsx";
import {useContext} from "react";
import LangContext from "@/context/LangContext.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useQuery} from "@tanstack/react-query";
import {getMateri} from "@/app/api/api-cbt.ts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../ui/card";
import {Button} from "@/components/ui/button.tsx";
import {Materi} from "@/types/types.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {DocumentLink} from "@/components/lesson/viewer/document-link.tsx";

const VITE_ASSET_DOMAIN = import.meta.env.VITE_ASSET_DOMAIN;
export default function SubjectPage() {
    const {subject, idKelas, idMapel} = useParams<{ subject: string; idKelas: string; idMapel: string }>();
    const id_kelas = idKelas ? parseInt(idKelas, 10) : undefined;
    const id_mapel = idMapel ? parseInt(idMapel, 10) : undefined;
    const subjectMap: Record<string, { title: string; description: string; color: string }> = {
        ipa: {title: "IPA", description: "Ilmu Pengetahuan Alam", color: "bg-blue-100"},
        ips: {title: "IPS", description: "Ilmu Pengetahuan Sosial", color: "bg-green-100"},
        matematika: {title: "Matematika", description: "Aljabar, Geometri, Statistik", color: "bg-purple-100"},
    };
    const currentSubject = subject
        ? subjectMap[subject] || {
        title: subject.charAt(0).toUpperCase() + subject.slice(1).replace("-", " "),
        description: "Materi Pembelajaran",
        color: "bg-gray-100"
    }
        : {title: "", description: "", color: ""};
    const {data, isLoading, error} = useQuery({
        queryKey: ["Materi", id_kelas, id_mapel],
        queryFn: () => {
            if (id_kelas === undefined || id_mapel === undefined) {
                return Promise.reject(new Error("kelasId atau mapelId tidak valid"));
            }
            return getMateri({id_kelas, id_mapel});
        },
        staleTime: 10 * 60 * 1000,
        enabled: !!id_kelas && !!id_mapel,
        refetchOnWindowFocus: true,
        retry: 1,
    });
    console.log(data)
    const {locale} = useContext(LangContext);
    const safeLocale = locale === "id" || locale === "en" ? locale : "en";
    const pageData: Record<"id" | "en", { name: string; url: string }[]> = {
        id: [{name: "Materi", url: "/lesson"}, {name: "Buku Materi", url: "#"}],
        en: [{name: "Lesson", url: "/lesson"}, {name: "Lesson Book", url: "/lesson"}],
    };
    return (
        <Layout data={pageData[safeLocale]}>
            <div className="container mx-auto py-6 px-4 md:px-6">
                <div className="mb-6">
                    <Link to="/lesson"
                          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4">
                        <ArrowLeft className="mr-1 h-4 w-4"/>
                        {locale === "id" ? "Kembali" : "Back"}
                    </Link>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                            <div
                                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center ${currentSubject.color}`}>
                                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8"/>
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{currentSubject.title}</h1>
                                <p className="text-muted-foreground">{currentSubject.description}</p>
                            </div>
                        </div>
                        <Input placeholder={locale === "id" ? "Cari Materi Pembelajaran" : "Search Lesson Books"}/>
                    </div>
                </div>

                {isLoading &&
                   <div className="flex w-full h-screen gap-4 p-4 pt-0">
                      <div className="w-full gap-4 flex-col flex">
                         <Skeleton className="w-[100%] h-[25%] max-md:w-[100%] max-md:h-[50%] rounded-20"/>
                         <Skeleton className="w-[100%] h-[25%] max-md:w-[100%] max-md:h-[50%] rounded-20"/>
                         <Skeleton className="w-[100%] h-[25%] max-md:w-[100%] max-md:h-[50%] rounded-20"/>

                      </div>
                   </div>
                }
                {error && <p className="text-red-500">Gagal mengambil data: {error.message}</p>}

                <div className="grid gap-4">
                    {data && data.length > 0 ? (
                        data.map((materi: Materi) => <MateriCard key={materi.id_materi} materi={materi}/>)
                    ) : (
                        <p className="text-gray-500">Tidak ada materi tersedia</p>
                    )}
                </div>
            </div>
        </Layout>
    );
}

interface MateriCard {
    materi: Materi;
}

function MateriCard({materi}: MateriCard) {
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
                        
                        <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none">
                            {/*<Link to={`/materi/${materi.id_materi}`}>Buka Materi</Link>*/}
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
