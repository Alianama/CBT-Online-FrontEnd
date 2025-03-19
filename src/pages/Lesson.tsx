"use client";
import {useContext} from "react";
import {Input} from "@/components/ui/input.tsx";
import {Search} from "lucide-react";
import Layout from "@/components/sidebar/Layout.tsx";
import LangContext from "@/context/LangContext.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import MapelCard from "@/components/lesson/MapelCard.tsx";
import {useQuery} from "@tanstack/react-query";
import {getMapel} from "@/app/api/api-cbt.ts";
import {useGlobal} from "@/context/GlobalContext.tsx";
import type {Mapel} from "@/types/types.ts"
import {useSearchParams} from "react-router-dom";

export default function Lesson() {
    const {locale} = useContext(LangContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") || "";
    const {generalUser} = useGlobal();
    const safeLocale = locale === "id" || locale === "en" ? locale : "en";
    const pageData = {
        id: {
            title: "Materi",
            header: "Portal Materi Pembelajaran",
            subHeader: "Pilih mata pelajaran untuk melihat materi pembelajaran",
            searchPlaceholder: "Cari mata pelajaran...",
            noData: "Tidak ada mata pelajaran tersedia.",
            error: "Terjadi kesalahan:"
        },
        en: {
            title: "Lesson",
            header: "Learning Materials Portal",
            subHeader: "Select a subject to view learning materials",
            searchPlaceholder: "Search subjects...",
            noData: "No subjects available.",
            error: "Error occurred:"
        }
    };
    const {
        data,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["mapel"],
        queryFn: () => getMapel(generalUser?.id_kelas),
        staleTime: 10 * 60 * 1000,
        refetchOnWindowFocus: true,
    });
    return (
        <Layout data={[{name: pageData[safeLocale].title, url: "/lesson"}]}>
            <title>{pageData[safeLocale].title}</title>

            <div className="container mx-auto py-6 px-4 md:px-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">{pageData[safeLocale].header}</h1>
                    <p className="text-muted-foreground">{pageData[safeLocale].subHeader}</p>
                </header>

                {isLoading ? (
                    <div className="flex w-full h-screen gap-4 p-4 pt-0">
                        <div className="w-full pt-20 gap-4 max-md:flex-col flex">
                            <Skeleton className="w-[25%] h-[30%] max-md:w-[100%] max-md:h-[50%] rounded-20"/>
                            <Skeleton className="w-[25%] h-[30%] max-md:w-[100%] max-md:h-[50%] rounded-20"/>
                            <Skeleton className="w-[25%] h-[30%] max-md:w-[100%] max-md:h-[50%] rounded-20"/>
                            <Skeleton className="w-[25%] h-[30%] max-md:w-[100%] max-md:h-[50%] rounded-20"/>
                            <Skeleton className="w-[25%] h-[30%] max-md:w-[100%] max-md:h-[50%] rounded-20"/>
                        </div>
                    </div>
                ) : error ? (
                    <p className="text-center text-red-500 text-lg">{pageData[safeLocale].error} {error.message}</p>
                ) : (
                    <div className="flex flex-col gap-6 mb-8">
                        <div className="relative w-full">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
                            <Input
                                type="search"
                                placeholder={pageData[safeLocale].searchPlaceholder}
                                className="w-full pl-8"
                                value={keyword}
                                onChange={(e) => setSearchParams({keyword: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {data?.data.length === 0 ? (
                                <p className="text-center text-gray-500 col-span-full">{pageData[safeLocale].noData}</p>
                            ) : (
                                data?.data
                                    .filter((mapel: Mapel) => mapel.total_materi > 0 &&
                                        mapel.nama_mapel.toLowerCase().includes(keyword.toLowerCase())
                                    )
                                    .sort((a: { total_materi: number; }, b: {
                                        total_materi: number;
                                    }) => b.total_materi - a.total_materi)
                                    .map((mapel: Mapel) => (
                                        <MapelCard
                                            key={mapel.id_mapel}
                                            id_mapel={mapel.id_mapel}
                                            id_kelas={generalUser?.id_kelas}
                                            title={mapel.nama_mapel}
                                            mapel_code={mapel.kode_mapel}
                                            total_materi={mapel.total_materi}
                                            bgImage={mapel.icon}
                                        />
                                    ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}




