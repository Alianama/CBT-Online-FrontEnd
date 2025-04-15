import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Calendar, Clock, FileText, Info, Play} from "lucide-react";
import {format, parseISO} from "date-fns";
import {ScheduleCardProps} from "@/types/types.ts";
import LanguageContext from "@/context/LanguageContext.tsx";
import {useContext, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import InsertToken from "@/components/exam/InsertToken.tsx";

type Locale = "id" | "en";
const translations: Record<Locale, {
    active: string;
    inactive: string;
    examination: string;
    date: string;
    time: string;
    duration: string;
    type: string;
}> = {
    id: {
        active: "Aktif",
        inactive: "Tidak Aktif",
        examination: "Ujian",
        date: "Tanggal",
        time: "Waktu",
        duration: "Durasi",
        type: "Jenis",
    },
    en: {
        active: "Active",
        inactive: "Inactive",
        examination: "Examination",
        date: "Date",
        time: "Time",
        duration: "Duration",
        type: "Type",
    },
};
export default function ScheduleCard({examData}: ScheduleCardProps) {
    console.log(examData)
    const {locale} = useContext(LanguageContext);
    const [isInsertToken, setIsInsertToken] = useState<boolean>(false);
    const t = translations[(locale as Locale) || "id"];
    const examDate = parseISO(examData.tanggal_ujian);
    const formattedDate = format(examDate, "MMMM d, yyyy");
    const durationInMinutes = Math.floor(examData.durasi_ujian / 60);
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    const formattedDuration = `${hours}h ${minutes}m`;
    return (
        <>
            <Card className=" hover:rotate-[0.9deg] hover:brightness-105 w-full max-w-xs overflow-hidden
             border-0 shadow-lg transition-transform duration-300 ease-out hover:scale-[1.03] hover:shadow-xl hover:-translate-y-1">
                <div className="h-2 bg-gradient-to-r from-primary to-blue-500"/>
                <CardHeader className="bg-sidebar-secondary pb-0">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xl font-semibold text-black dark:text-white">
                            {examData.nama_bank}
                        </CardTitle>
                        <Badge
                            variant={examData.status_ujian === 1 ? "default" : "outline"}
                            className="bg-primary font-medium"
                        >
                            {examData.status_ujian === 1 ? t.active : t.inactive}
                        </Badge>
                    </div>
                    <div className="text-sm text-slate-500 font-medium mt-1">
                        {examData.jenis_ujian} {t.examination}
                    </div>
                </CardHeader>

                <CardContent className="pt-6 pb-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Calendar className="h-4 w-4 text-slate-400"/>
                                <span className="text-sm font-medium">{t.date}</span>
                            </div>
                            <p className="text-sm font-semibold pl-6">{formattedDate}</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Clock className="h-4 w-4 text-slate-400"/>
                                <span className="text-sm font-medium">{t.time}</span>
                            </div>
                            <p className="text-sm font-semibold pl-6">{examData.jam_ujian}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Info className="h-4 w-4 text-slate-400"/>
                                <span className="text-sm font-medium">{t.duration}</span>
                            </div>
                            <p className="text-sm font-semibold pl-6">{formattedDuration}</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-slate-600">
                                <FileText className="h-4 w-4 text-slate-400"/>
                                <span className="text-sm font-medium">{t.type}</span>
                            </div>
                            <p className="text-sm font-semibold pl-6">{examData.jenis_ujian}</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex gap-10 justify-end">
                    <span>{"-->"}</span>
                    <Button
                        onClick={() => {
                            if (examData.token === 1) {
                                setIsInsertToken(true);
                            } else {
                                alert("Token ujian belum tersedia.");
                            }
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-blue-700  dark:bg-neutral-200 text-secondary text-xs font-bold flex items-center gap-1"
                    >
                        <Play className="w-4 h-4"/> Mulai Ujian
                    </Button>

                </CardFooter>
            </Card>
            <InsertToken id_peserta={examData.id_peserta} isInsertToken={isInsertToken}
                         setIsInsertToken={setIsInsertToken}/>
        </>
    );
}
