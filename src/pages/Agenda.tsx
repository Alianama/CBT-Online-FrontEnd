"use client";
import { useContext, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { EventList } from "@/components/schedule/calendar-listevent.tsx";
import { CalendarHeader } from "@/components/schedule/calendar-header.tsx";
import Layout from "@/components/sidebar/Layout.tsx";
import LanguageContext from "@/context/LanguageContext.tsx";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { useQuery } from "@tanstack/react-query";
import { getAgenda } from "@/app/api/api-cbt.ts";
import { useGlobal } from "@/context/GlobalContext.tsx";

// {data, isLoading, error} : { data?: AgendaResponse; isLoading: boolean; error?: Error | null }
export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const handlePrevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  const handleNextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  const handleToday = () => setCurrentDate(new Date());
  const { locale } = useContext(LanguageContext);
  const safeLocale = locale === "id" || locale === "en" ? locale : "en";
  const pageData: Record<"id" | "en", { name: string; url: string }> = {
    id: { name: "Agenda", url: "/agenda" },
    en: { name: "Agenda", url: "/agenda" },
  };
  const { data, error, isLoading } = useQuery({
    queryKey: ["agenda"],
    queryFn: getAgenda,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const { school } = useGlobal();
  const pageTitle = "CBT Online | " + pageData[safeLocale].name + " - " + school;

  return (
    <Layout data={[pageData[safeLocale]]}>
      <title>{pageTitle}</title>
      <div className="flex flex-col min-h-screen">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onToday={handleToday}
        />
        {error ? (
          <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-red-500 text-lg">⚠️ {error.message}</h1>
          </div>
        ) : isLoading ? (
          <div className="flex w-full h-screen gap-4 p-4 pt-0">
            <div className="w-full pt-20 gap-5 max-md:flex-col flex">
              <Skeleton className="w-[75%] h-[100%] max-md:w-[100%] max-md:h-[50%] rounded-20" />
              <Skeleton className="w-[25%] h-[100%] max-md:w-[100%] max-md:h-[50%] rounded-20" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row flex-1 gap-4 p-4">
            <div className="md:w-3/4 bg-card rounded-lg shadow-sm border">
              <Calendar currentDate={currentDate} events={data?.data} />
            </div>
            <div className="md:w-1/4 bg-card rounded-lg shadow-sm border p-4">
              <EventList currentDate={currentDate} events={data?.data} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
