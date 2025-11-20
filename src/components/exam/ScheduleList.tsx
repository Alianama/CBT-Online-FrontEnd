import ScheduleCard from "@/components/exam/ScheduleCard.tsx";
import { useQuery } from "@tanstack/react-query";
import { getJadwalList } from "@/app/api/api-cbt.ts";
import { ExamData } from "@/types/types.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import LanguageContext from "@/context/LanguageContext.tsx";
import { useContext } from "react";

type Locale = "id" | "en";

interface TranslationStrings {
  title: string;
  subtitle: string;
  loading: string;
  error: string;
  empty: string;
}

interface ScheduleResponse {
  status: string;
  data: {
    sesi_ujian: number;
    sesi_remedial: number;
    jadwal: ExamData[];
  };
}

const translations: Record<Locale, TranslationStrings> = {
  id: {
    title: "Jadwal Ujian",
    subtitle: "Pilih Jadwal Ujian yang ingin dikerjakan",
    loading: "Memuat jadwal ujian...",
    error: "Gagal memuat jadwal ujian.",
    empty: "Tidak ada jadwal ujian tersedia.",
  },
  en: {
    title: "Exam Schedule",
    subtitle: "Select the exam schedule you want to take",
    loading: "Loading exam schedules...",
    error: "Failed to load exam schedules.",
    empty: "No exam schedules available.",
  },
};

export default function ExamCard() {
  const { data, error, isLoading } = useQuery<ScheduleResponse>({
    queryKey: ["ScheduleList"],
    queryFn: getJadwalList,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const scheduleList = data?.data?.jadwal;
  const { locale } = useContext(LanguageContext);
  const t = translations[(locale as Locale) || "id"];

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </header>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-md space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-red-500">{t.error}</p>}

      {scheduleList && scheduleList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scheduleList.map((examData) => (
            <ScheduleCard
              key={`${examData.id_peserta}-${examData.id_bank}`}
              data={examData}
              sesi_ujian={data?.data?.sesi_ujian || 0}
              sesi_remedial={data?.data?.sesi_remedial || 0}
            />
          ))}
        </div>
      ) : (
        !isLoading && <p>{t.empty}</p>
      )}
    </div>
  );
}
