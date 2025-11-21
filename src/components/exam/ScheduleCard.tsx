import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Calendar, Clock, FileText, Info, Play } from "lucide-react";
import { format, parseISO, isSameMonth, isToday } from "date-fns";
import { ExamData } from "@/types/types.ts";
import LanguageContext from "@/context/LanguageContext.tsx";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import InsertToken from "@/components/exam/InsertToken.tsx";
import { toast } from "sonner";
import { postTokenUjian } from "@/app/api/api-cbt.ts";
import { useGlobal } from "@/context/GlobalContext.tsx";
import { useNavigate } from "react-router-dom";

type Locale = "id" | "en";
const translations: Record<
  Locale,
  {
    active: string;
    inactive: string;
    examination: string;
    date: string;
    time: string;
    duration: string;
    type: string;
  }
> = {
  id: {
    active: "Belum Ujian",
    inactive: "Sedang Ujian",
    examination: "Ujian",
    date: "Tanggal",
    time: "Waktu",
    duration: "Durasi",
    type: "Jenis",
  },
  en: {
    active: "Not Tested Yet",
    inactive: "Under Tested",
    examination: "Examination",
    date: "Date",
    time: "Time",
    duration: "Duration",
    type: "Type",
  },
};

interface ScheduleCardProps {
  data: ExamData;
  sesi_ujian: number;
  sesi_remedial: number;
}

export default function ScheduleCard({
  data,
  sesi_ujian,
  sesi_remedial,
}: ScheduleCardProps) {
  const { locale } = useContext(LanguageContext);
  const [isInsertToken, setIsInsertToken] = useState<boolean>(false);
  const t = translations[(locale as Locale) || "id"];
  const examDate = parseISO(data.tanggal_ujian);
  const { setWsToken } = useGlobal();
  const navigate = useNavigate();

  const now = new Date();
  const [jam, menit] = data.jam_ujian.split(":").map(Number);
  const examStartDate = new Date(examDate);
  examStartDate.setHours(jam, menit, 0, 0);

  const examEndDate = new Date(
    examStartDate.getTime() + data.durasi_ujian * 1000
  );

  const isRemedial = sesi_remedial === 1;
  const isSameMonthAsNow = isSameMonth(examDate, now);

  let isButtonDisabled = false;
  let examStatusText = "Mulai Ujian";

  const currentHour = now.getHours();

  switch (sesi_ujian) {
    case 0:
      if (isRemedial) {
        if (!isSameMonthAsNow) {
          isButtonDisabled = true;
          examStatusText = "Bukan bulan remedial";
        } else {
          const todayExamStart = new Date(now);
          todayExamStart.setHours(jam, menit, 0, 0);
          const todayExamEnd = new Date(
            todayExamStart.getTime() + data.durasi_ujian * 1000
          );

          if (now < todayExamStart) {
            isButtonDisabled = true;
            examStatusText = "Belum Waktunya";
          } else if (now > todayExamEnd) {
            isButtonDisabled = true;
            examStatusText = "Waktu Habis";
          }
        }
      } else {
        if (isToday(examDate)) {
          const isAfterStart = now >= examStartDate;
          const isExamExpired = now > examEndDate;

          if (isExamExpired) {
            isButtonDisabled = true;
            examStatusText = "Waktu Habis";
          } else if (!isAfterStart) {
            isButtonDisabled = true;
            examStatusText = "Belum Waktunya";
          }
        } else if (now < examDate) {
          isButtonDisabled = true;
          examStatusText = "Bukan Hari Ujian";
        } else {
          isButtonDisabled = true;
          examStatusText = "Waktu Habis";
        }
      }
      break;
    case 1:
      if (isRemedial) {
        if (!isSameMonthAsNow) {
          isButtonDisabled = true;
          examStatusText = "Bukan bulan remedial";
        } else {
          const todayExamStart = new Date(now);
          todayExamStart.setHours(jam, menit, 0, 0);
          const todayExamEnd = new Date(
            todayExamStart.getTime() + data.durasi_ujian * 1000
          );

          const isFlexibleTime = currentHour >= 15 && currentHour < 17;
          const isExactTime = currentHour === jam;

          if (now > todayExamEnd) {
            isButtonDisabled = true;
            examStatusText = "Waktu Habis";
          } else {
            isButtonDisabled = !(isFlexibleTime || isExactTime);
            if (!(isFlexibleTime || isExactTime)) {
              examStatusText = "Belum Waktunya";
            }
          }
        }
      } else {
        if (isToday(examDate)) {
          const isFlexibleTime = currentHour >= 15 && currentHour < 17;
          const isExactTime = currentHour === jam;
          const isExamExpired = now > examEndDate;

          if (isExamExpired) {
            isButtonDisabled = true;
            examStatusText = "Waktu Habis";
          } else {
            isButtonDisabled = !(isFlexibleTime || isExactTime);
            if (!(isFlexibleTime || isExactTime)) {
              examStatusText = "Belum Waktunya";
            }
          }
        } else if (now < examDate) {
          isButtonDisabled = true;
          examStatusText = "Bukan Hari Ujian";
        } else {
          isButtonDisabled = true;
          examStatusText = "Waktu Habis";
        }
      }
      break;
    case 2:
      if (isRemedial) {
        if (!isSameMonthAsNow) {
          isButtonDisabled = true;
          examStatusText = "Bukan bulan remedial";
        } else {
          const todayExamStart = new Date(now);
          todayExamStart.setHours(jam, menit, 0, 0);
          const todayExamEnd = new Date(
            todayExamStart.getTime() + data.durasi_ujian * 1000
          );

          const isInTimeWindow = now >= todayExamStart && now <= todayExamEnd;

          isButtonDisabled = !isInTimeWindow;

          if (now < todayExamStart) {
            examStatusText = "Belum Waktunya";
          } else if (now > todayExamEnd) {
            examStatusText = "Waktu Habis";
          }
        }
      } else {
        if (isToday(examDate)) {
          const isRunning = now >= examStartDate && now <= examEndDate;

          isButtonDisabled = !isRunning;

          if (now < examStartDate) {
            examStatusText = "Belum Waktunya";
          } else if (now > examEndDate) {
            examStatusText = "Waktu Habis";
          }
        } else if (now < examDate) {
          isButtonDisabled = true;
          examStatusText = "Bukan Hari Ujian";
        } else {
          isButtonDisabled = true;
          examStatusText = "Waktu Habis";
        }
      }
      break;
  }

  const onSubmitWithoutToken = async () => {
    try {
      const response = await postTokenUjian(null, data.id_peserta);
      const websocket = response.data;

      if (response.status === "success") {
        setWsToken(websocket.token);
        toast.success("Token berhasil diverifikasi!");
        navigate(`/exam/start`, { replace: true });
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan yang tidak diketahui.";
      toast.error(message);
    }
  };

  const formattedDate = format(examDate, "MMMM d, yyyy");
  const durationInMinutes = Math.floor(data.durasi_ujian / 60);
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  const formattedDuration = `${hours}h ${minutes}m`;
  return (
    <>
      <Card
        className=" hover:rotate-[0.9deg] hover:brightness-105 w-full max-w-xs overflow-hidden
             border-0 shadow-lg transition-transform duration-300 ease-out hover:scale-[1.03] hover:shadow-xl hover:-translate-y-1"
      >
        <div className="h-2 bg-gradient-to-r from-primary to-blue-500" />
        <CardHeader className="bg-sidebar-secondary pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold text-black dark:text-white">
              {data.nama_bank}
            </CardTitle>
            <Badge
              variant={data.status_ujian === 1 ? "default" : "outline"}
              className="bg-primary font-medium"
            >
              {data.status_ujian === 1 ? t.active : t.inactive}
            </Badge>
          </div>
          <div className="text-sm text-slate-500 font-medium mt-1">
            {data.jenis_ujian} {t.examination}
          </div>
        </CardHeader>

        <CardContent className="pt-6 pb-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium">{t.date}</span>
              </div>
              <p className="text-sm font-semibold pl-6">{formattedDate}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium">{t.time}</span>
              </div>
              <p className="text-sm font-semibold pl-6">{data.jam_ujian}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-600">
                <Info className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium">{t.duration}</span>
              </div>
              <p className="text-sm font-semibold pl-6">{formattedDuration}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-600">
                <FileText className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-medium">{t.type}</span>
              </div>
              <p className="text-sm font-semibold pl-6">{data.jenis_ujian}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-10 justify-end">
          <span>{"-->"}</span>
          <Button
            disabled={isButtonDisabled}
            onClick={async () => {
              if (data.token === 0) {
                try {
                  await onSubmitWithoutToken();
                } catch (error) {
                  console.error("Gagal submit tanpa token:", error);
                  toast("Terjadi kesalahan saat submit.");
                }
                return;
              }

              if (data.token === 1 && !isButtonDisabled) {
                setIsInsertToken(true);
              } else if (isButtonDisabled) {
                toast(examStatusText);
              } else {
                toast("Token ujian belum tersedia.");
              }
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-blue-700 dark:bg-neutral-200 text-secondary text-xs font-bold flex items-center gap-1"
          >
            <Play className="w-4 h-4" /> {examStatusText}
          </Button>
        </CardFooter>
      </Card>
      <InsertToken
        id_peserta={data.id_peserta}
        isInsertToken={isInsertToken}
        setIsInsertToken={setIsInsertToken}
      />
    </>
  );
}
