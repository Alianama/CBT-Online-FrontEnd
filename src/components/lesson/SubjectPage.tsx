"use client";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, BookOpen } from "lucide-react";
import Layout from "@/components/sidebar/Layout.tsx";
import { useContext } from "react";
import LanguageContext from "@/context/LanguageContext.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useQuery } from "@tanstack/react-query";
import { getMateri } from "@/app/api/api-cbt.ts";
import { Materi } from "@/types/types.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import MateriCard from "@/components/lesson/materi-card.tsx";

export default function SubjectPage() {
  const { subject, idKelas, idMapel } = useParams<{
    subject: string;
    idKelas: string;
    idMapel: string;
  }>();
  const id_kelas = idKelas ? parseInt(idKelas, 10) : undefined;
  const id_mapel = idMapel ? parseInt(idMapel, 10) : undefined;
  const subjectMap: Record<
    string,
    { title: string; description: string; color: string }
  > = {};
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || ""; // Ambil keyword dari URL
  const currentSubject = subject
    ? subjectMap[subject] || {
        title:
          subject.charAt(0).toUpperCase() + subject.slice(1).replace("-", " "),
        description: "Materi Pembelajaran",
        color: "bg-gray-100",
      }
    : { title: "", description: "", color: "" };
  const { data, isLoading, error } = useQuery({
    queryKey: ["Materi", id_kelas, id_mapel],
    queryFn: () => {
      if (id_kelas === undefined || id_mapel === undefined) {
        return Promise.reject(new Error("kelasId atau mapelId tidak valid"));
      }
      return getMateri({ id_kelas, id_mapel });
    },
    staleTime: 10 * 60 * 1000,
    enabled: !!id_kelas && !!id_mapel,
    refetchOnWindowFocus: true,
    retry: 1,
  });
  const { locale } = useContext(LanguageContext);
  const safeLocale = locale === "id" || locale === "en" ? locale : "en";
  const pageData: Record<"id" | "en", { name: string; url: string }[]> = {
    id: [
      { name: "Materi", url: "/lesson" },
      { name: "Buku Materi", url: "#" },
    ],
    en: [
      { name: "Lesson", url: "/lesson" },
      { name: "Lesson Book", url: "#" },
    ],
  };
  return (
    <Layout data={pageData[safeLocale]}>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="mb-6">
          <Link
            to="/lesson"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            {locale === "id" ? "Kembali" : "Back"}
          </Link>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center ${currentSubject.color}`}
              >
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-neutral-900 " />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  {currentSubject.title}
                </h1>
                <p className="text-muted-foreground">
                  {currentSubject.description}
                </p>
              </div>
            </div>
            <Input
              value={keyword}
              onChange={(e) => setSearchParams({ keyword: e.target.value })}
              placeholder={
                locale === "id"
                  ? "Cari Materi Pembelajaran"
                  : "Search Lesson Books"
              }
            />
          </div>
        </div>

        {isLoading && (
          <div className="flex w-full h-screen gap-4 p-4 pt-0">
            <div className="w-full gap-4 flex-col flex">
              <Skeleton className="w-[100%] h-[25%] max-md:w-[100%] max-md:h-[50%] rounded-20" />
              <Skeleton className="w-[100%] h-[25%] max-md:w-[100%] max-md:h-[50%] rounded-20" />
              <Skeleton className="w-[100%] h-[25%] max-md:w-[100%] max-md:h-[50%] rounded-20" />
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-500">Gagal mengambil data: {error.message}</p>
        )}

        <div className="grid grid-cols-1 gap-4">
          {data && data.length > 0 ? (
            data
              .filter(
                (materi: Materi) =>
                  !keyword ||
                  materi.title.toLowerCase().includes(keyword.toLowerCase()),
              )
              .map((materi: Materi) => (
                <MateriCard
                  key={materi.id_materi}
                  subject={subject}
                  idKelas={idKelas}
                  idMapel={idMapel}
                  materi={materi}
                />
              ))
          ) : (
            <p className="text-gray-500">Tidak ada materi tersedia</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
