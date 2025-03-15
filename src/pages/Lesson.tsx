"use client";

import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Search, FlaskRoundIcon as Flask } from "lucide-react";
import Layout from "@/components/sidebar/Layout.tsx";
import LangContext from "@/context/LangContext.tsx";
import {Skeleton} from "@/components/ui/skeleton.tsx";
import {LessonProps, SubjectCardProps} from "@/types/types.ts";



export default function Lesson({ data, isLoading, error }: LessonProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { locale } = useContext(LangContext);

  const safeLocale = locale === "id" || locale === "en" ? locale : "en";
  const pageData: Record<"id" | "en", { name: string; url: string }> = {
    id: { name: "Materi", url: "/lesson" },
    en: { name: "Lesson", url: "/lesson" },
  };

  return (
    <Layout data={[pageData[safeLocale]]}>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Portal Materi Pembelajaran</h1>
          <p className="text-muted-foreground">
            Pilih mata pelajaran untuk melihat materi pembelajaran
          </p>
        </header>

        {isLoading ? (
          <div className="flex w-full h-screen gap-4 p-4 pt-0">
            <div className="w-full pt-20 gap-5 max-md:flex-col flex">
              <Skeleton className="w-[75%] h-[100%] max-md:w-[100%] max-md:h-[50%] rounded-20" />
              <Skeleton className="w-[25%] h-[100%] max-md:w-[100%] max-md:h-[50%] rounded-20" />
            </div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">Error: {error.message}</p>
        ) : (
          <div className="flex flex-col gap-6 mb-8">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari mata pelajaran..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {data?.data.length === 0 ? (
                <p className="text-center text-gray-500 col-span-full">Tidak ada mata pelajaran tersedia.</p>
              ) : (
                data?.data
                  .filter((mapel) =>
                    mapel.nama_mapel.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .sort((a, b) => b.materials - a.materials) // ✅ Urutkan berdasarkan jumlah materi (descending)
                  .map((mapel) => (
                    <SubjectCard
                      key={mapel.id_mapel}
                      title={mapel.nama_mapel}
                      icon={<Flask className="h-8 w-8"/>}
                      mapel_code={mapel.kode_mapel}
                      color="bg-blue-100"
                      textColor="text-blue-600"
                      materials={mapel.materials} // ✅ Pastikan jumlah materi sesuai data
                      description={""}                    />
                  ))
              )}
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}



function SubjectCard({ title, icon, color, textColor, materials, mapel_code }: SubjectCardProps) {
  return (
    <Link to={`/subjects/${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
        <CardHeader className="pb-2 px-3 pt-3 sm:px-6 sm:pt-6">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center mb-2 ${color}`}>
            <div className={textColor}>{icon}</div>
          </div>
          <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
          <p className="text-xs text-sidebar-primary/40" >{mapel_code}</p>
        </CardHeader>
        <CardContent className="pb-2 px-3 sm:px-6">
          <p className={`text-sm ${materials === 0 ? "text-red-600" : ""}`}>
            {materials} materi pembelajaran
          </p>
        </CardContent>
        <CardFooter className="px-3 pb-3 sm:px-6 sm:pb-6">
          <Button variant="ghost" className="w-full text-primary justify-start p-2 h-8 text-sm">
            Lihat Materi
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
