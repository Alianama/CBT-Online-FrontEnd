import {useState, useEffect} from "react";
import {Card} from "@/components/ui/card";
import ExamQuestions from "./component/exam-questions.tsx";
import QuestionNavigation from "./component/question-navigation";
import Timer from "./component/timer";
import {Button} from "@/components/ui/button";
import {useIsMobile} from "@/hooks/use-mobile";
import {useExamSocket} from "@/hooks/useExamSocket.tsx";
import {BadgeInfo} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";

export default function ExamPage() {

    const { soal, setTimer, timer, readyState, sendJawaban, submitUjian, } = useExamSocket();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string | null>>({});
    const [examFinished, setExamFinished] = useState(false);

    const [openSubmitAlert, setOpenSubmitAlert] = useState(false);
    const isMobile = useIsMobile();
    const statusList = ['Connecting', 'Online', 'Closing', 'Offline'];
    const navigate = useNavigate();
    useEffect(() => {
        if (!soal) return;
        const initialAnswers: Record<number, string | null> = {};
        soal.forEach((q) => {
            initialAnswers[q.id_soal_ujian] = null;
        });
        setAnswers(initialAnswers);
    }, [soal]);

    // useEffect(() => {
    //     if (timer === null) return;
    //     if (timer <= 0) {
    //         submitUjian();
    //         toast.success("Time Up! Redirect To Result");
    //         return;
    //     }
    //
    //     const interval = setInterval(() => {
    //         setTimer((prev) => (prev !== null ? prev - 1 : null));
    //     }, 1000);
    //
    //     return () => clearInterval(interval);
    // }, [timer]);

    useEffect(() => {
        const interval = setInterval(() => {
            const endTimeStr = localStorage.getItem("exam_end_time");
            if (!endTimeStr) return;

            const endTime = parseInt(endTimeStr);
            const now = Date.now();
            const remaining = Math.floor((endTime - now) / 1000);

            if (remaining <= 0) {
                setTimer(0);
                submitUjian();
                toast.success("Time Up! Redirect To Result");
                setExamFinished(true);
                clearInterval(interval);
            } else {
                setTimer(remaining);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [submitUjian, setTimer]);

    const onSetTimeLeft = (sisa_time : any) => {
        console.log("setTimeLeft", sisa_time);
        setTimer(sisa_time)
    }


    const handleAnswerChange = (questionId: number, answer: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }));
        sendJawaban(questionId, answer);
    };
    const handleFinishExam = () => {
        setOpenSubmitAlert(true);
    };
    const allQuestionsAnswered = Object.values(answers).every((a) => a !== null);

    if (examFinished) {
        return (
            <div className="container mx-auto py-8 px-4 text-center">
                <Card className="p-8">
                    <h1 className="text-2xl font-bold mb-4">Exam Completed</h1>
                    <p className="mb-4">Thank you for completing the exam.</p>
                    <Button onClick={() => navigate("/result")}>Lihat Detail Hasil</Button>
                </Card>
            </div>
        );
    }
    return (
        <div className="container mx-auto py-4 px-2 md:px-4">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Mobile Navigation */}
                {isMobile && (
                    <Card className="p-4 mb-4 w-full">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold">Questions</h2>
                            <Timer timeLeft={timer} setTimeLeft={onSetTimeLeft} onTimeUp={() => navigate("/result")}/>
                        </div>
                        <QuestionNavigation
                            questions={soal}
                            currentQuestion={currentQuestion}
                            setCurrentQuestion={setCurrentQuestion}
                            answers={answers}
                            isMobile={true}
                        />
                    </Card>
                )}

                {/* Main Content */}
                <div className={`flex-1 ${!isMobile ? "order-1" : ""}`}>
                    <Card className="p-4 mb-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-xl font-bold">Exam Questions</h1>
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
                                <p className={`text-xs ${statusList[readyState]}`}>
                                    {statusList[readyState]}
                                </p>
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
                        <ExamQuestions
                            questions={soal}
                            currentQuestion={currentQuestion}
                            onAnswerChange={handleAnswerChange}
                            answers={answers}
                        />
                        <div className="flex justify-between mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                                disabled={currentQuestion === 0}
                            >
                                Previous
                            </Button>
                            {currentQuestion < soal.length - 1 ? (
                                <Button
                                    onClick={() => setCurrentQuestion((prev) => Math.min(soal.length - 1, prev + 1))}>
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    variant="default"
                                    onClick={handleFinishExam}
                                    className={allQuestionsAnswered ? "bg-green-600 hover:bg-green-700" : ""}
                                >
                                    Finish Exam
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Desktop Navigation */}
                {!isMobile && (
                    <Card className="p-4 w-64 h-fit sticky top-4">
                        <h2 className="text-lg font-semibold mb-4">Questions</h2>
                        <QuestionNavigation
                            questions={soal}
                            currentQuestion={currentQuestion}
                            setCurrentQuestion={setCurrentQuestion}
                            answers={answers}
                            isMobile={false}
                        />
                        {allQuestionsAnswered && (
                            <Button
                                variant="default"
                                onClick={handleFinishExam}
                                className="w-full mt-4 bg-green-600 hover:bg-green-700"
                            >
                                Finish Exam
                            </Button>
                        )}
                    </Card>
                )}
            </div>

            {/* Submit Confirmation Dialog */}
            <Dialog open={openSubmitAlert} onOpenChange={setOpenSubmitAlert}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submit Jawaban</DialogTitle>
                        <DialogDescription>
                            Apakah kamu yakin ingin mengumpulkan jawabanmu sekarang? Aksi ini tidak bisa dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogTrigger asChild>
                            <Button variant="outline">Tidak</Button>
                        </DialogTrigger>
                        <Button
                            onClick={() => {
                                submitUjian();
                                setOpenSubmitAlert(false);
                                setExamFinished(true);
                            }}
                        >
                            Ya, Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
