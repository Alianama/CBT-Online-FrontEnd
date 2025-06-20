import { useState, useEffect, useContext } from "react";
import { Card } from "@/components/ui/card";
import ExamQuestions from "./component/exam-questions.tsx";
import QuestionNavigation from "./component/question-navigation";
import Timer from "./component/timer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useExamSocket } from "@/hooks/useExamSocket.tsx";
import { BadgeInfo } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { useNavigate } from "react-router-dom";
import LanguageContext from "@/context/LanguageContext.tsx";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobal } from "@/context/GlobalContext.tsx";
import { toast } from "sonner";
import { examActivityTracker } from "@/utils/examActivityTracker";

export default function ExamPage() {
  const { soal, setTimer, timer, readyState, sendJawaban, submitUjian } =
    useExamSocket();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string | null>>({});
  const [examFinished, setExamFinished] = useState(false);
  const [openSubmitAlert, setOpenSubmitAlert] = useState(false);
  const isMobile = useIsMobile();
  const statusList = ["Connecting", "Online", "Closing", "Offline"];
  const navigate = useNavigate();
  const { locale } = useContext(LanguageContext);
  const { wsToken } = useGlobal();

  const t = {
    id: {
      examCompleted: "Ujian Selesai",
      thankYou: "Terima kasih telah menyelesaikan ujian.",
      viewResult: "Lihat Detail Hasil",
      questions: "Daftar Soal",
      examQuestions: "Soal Ujian",
      submitTitle: "Submit Jawaban",
      submitDescription:
        "Apakah kamu yakin ingin mengumpulkan jawabanmu sekarang? Aksi ini tidak bisa dibatalkan.",
      cancel: "Tidak",
      confirmSubmit: "Ya, Submit",
      preparing: "Soal sedang disiapkan...",
      previous: "Sebelumnya",
      next: "Berikutnya",
      finishExam: "Kumpulkan Ujian",
    },
    en: {
      examCompleted: "Exam Completed",
      thankYou: "Thank you for completing the exam.",
      viewResult: "View Result",
      questions: "Questions",
      examQuestions: "Exam Questions",
      submitTitle: "Submit Answers",
      submitDescription:
        "Are you sure you want to submit your answers now? This action cannot be undone.",
      cancel: "No",
      confirmSubmit: "Yes, Submit",
      preparing: "Preparing questions...",
      previous: "Previous",
      next: "Next",
      finishExam: "Finish Exam",
    },
  }[locale as "id" | "en"];

  useEffect(() => {
    examActivityTracker.setPesertaId(
      Number(localStorage.getItem("id_peserta"))
    );

    // Mulai tracking aktivitas ujian
    examActivityTracker.startTracking();

    // Hapus semua history dan set state baru
    window.history.pushState(null, "", window.location.href);

    // Fungsi untuk menangani popstate
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      e.stopPropagation();
      window.history.pushState(null, "", window.location.href);
      toast.error("Tombol back tidak dapat digunakan selama ujian!");
      return false;
    };

    // Fungsi untuk menangani keydown (mencegah Alt+Left Arrow)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        toast.error("Tombol back tidak dapat digunakan selama ujian!");
        return false;
      }
    };

    // Fungsi untuk menangani beforeunload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    // Fungsi untuk menangani click pada tombol back browser
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 3) {
        // Tombol back mouse
        e.preventDefault();
        e.stopPropagation();
        toast.error("Tombol back tidak dapat digunakan selama ujian!");
        return false;
      }
    };

    // Tambahkan semua event listener
    window.addEventListener("popstate", handlePopState, true);
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("beforeunload", handleBeforeUnload, true);
    window.addEventListener("mousedown", handleMouseDown, true);

    // Tambahkan history state baru setiap kali komponen mount
    const interval = setInterval(() => {
      window.history.pushState(null, "", window.location.href);
    }, 1000);

    // Cleanup
    return () => {
      examActivityTracker.stopTracking();
      window.removeEventListener("popstate", handlePopState, true);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("beforeunload", handleBeforeUnload, true);
      window.removeEventListener("mousedown", handleMouseDown, true);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!soal) return;
    const initialAnswers: Record<number, string | null> = {};
    soal.forEach((q) => {
      initialAnswers[q.id_soal_ujian] = null;
    });
    setAnswers(initialAnswers);
  }, [soal]);

  const onSetTimeLeft = (sisa_time: any) => {
    setTimer(sisa_time);
  };

  const handleAnswerChange = (
    questionId: number,
    answer: string,
    type: number
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
    sendJawaban(questionId, answer, type);
  };

  const handleFinishExam = () => {
    setOpenSubmitAlert(true);
  };

  const allQuestionsAnswered = Object.values(answers).every((a) => a !== null);

  if (examFinished) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <Card className="p-8">
          <h1 className="text-2xl font-bold mb-4">{t.examCompleted}</h1>
          <p className="mb-4">{t.thankYou}</p>
          <Button onClick={() => navigate("/result")}>{t.viewResult}</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-2 md:px-4">
      <div className="flex flex-col md:flex-row gap-4">
        {isMobile && (
          <Card className="p-4 mb-4 w-full">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{t.questions}</h2>
              <Timer
                timeLeft={timer}
                setTimeLeft={onSetTimeLeft}
                onTimeUp={() => navigate("/result")}
              />
            </div>
            {soal ? (
              <QuestionNavigation
                questions={soal}
                currentQuestion={currentQuestion}
                setCurrentQuestion={setCurrentQuestion}
                answers={answers}
                isMobile={true}
              />
            ) : (
              <Skeleton className="h-24 w-full rounded-md" />
            )}
          </Card>
        )}

        <div className={`flex-1 ${!isMobile ? "order-1" : ""}`}>
          <Card className="p-4 mb-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">{t.examQuestions}</h1>
              <div className="flex items-center gap-2">
                <BadgeInfo
                  size={20}
                  className={
                    readyState === 0
                      ? "text-gray-400"
                      : readyState === 1
                        ? "text-green-500"
                        : readyState === 2
                          ? "text-yellow-500"
                          : "text-red-500"
                  }
                />
                <p className={`text-xs`}>{statusList[readyState]}</p>
              </div>
              {!isMobile && (
                <Timer
                  timeLeft={timer}
                  setTimeLeft={onSetTimeLeft}
                  onTimeUp={() => console.log("Reload Waktu Ujian")}
                />
              )}
            </div>
          </Card>

          <Card className="p-4 mb-4">
            {soal ? (
              <>
                <ExamQuestions
                  token={wsToken}
                  questions={soal}
                  currentQuestion={currentQuestion}
                  onAnswerChange={handleAnswerChange}
                  answers={answers}
                />
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentQuestion((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentQuestion === 0}
                  >
                    {t.previous}
                  </Button>

                  {currentQuestion < soal.length - 1 ? (
                    <Button
                      onClick={() =>
                        setCurrentQuestion((prev) =>
                          Math.min(soal.length - 1, prev + 1)
                        )
                      }
                    >
                      {t.next}
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      onClick={handleFinishExam}
                      className={
                        allQuestionsAnswered
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }
                    >
                      {t.finishExam}
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            )}
          </Card>
        </div>

        {!isMobile && (
          <Card className="p-4 w-64 h-fit sticky top-4">
            <h2 className="text-lg font-semibold mb-4">{t.questions}</h2>
            {soal ? (
              <>
                <QuestionNavigation
                  questions={soal}
                  currentQuestion={currentQuestion}
                  setCurrentQuestion={setCurrentQuestion}
                  answers={answers}
                  isMobile={false}
                />
                {allQuestionsAnswered && (
                  <Button
                    disabled={true}
                    variant="default"
                    onClick={handleFinishExam}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700"
                  >
                    {t.finishExam}
                  </Button>
                )}
              </>
            ) : (
              <Skeleton className="h-48 w-full" />
            )}
          </Card>
        )}
      </div>

      <Dialog open={openSubmitAlert} onOpenChange={setOpenSubmitAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.submitTitle}</DialogTitle>
            <DialogDescription>{t.submitDescription}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogTrigger asChild>
              <Button variant="outline">{t.cancel}</Button>
            </DialogTrigger>
            <Button
              onClick={() => {
                submitUjian();
                setOpenSubmitAlert(false);
                setExamFinished(true);
              }}
            >
              {t.confirmSubmit}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
