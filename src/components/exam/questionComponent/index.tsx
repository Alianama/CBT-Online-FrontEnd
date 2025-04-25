"use client"
import {useState, useEffect} from "react"
import {Card} from "@/components/ui/card"
import ExamQuestions from "./component/exam-questions.tsx"
import QuestionNavigation from "./component/question-navigation"
import Timer from "./component/timer"
import {Button} from "@/components/ui/button"
import {useIsMobile} from "@/hooks/use-mobile"
import {useExamSocket} from "@/hooks/useExamSocket.tsx";
import {BadgeInfo} from "lucide-react";
import useTimerStore from "@/stores/useTimerStore.ts";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle, DialogTrigger
} from "@/components/ui/dialog.tsx";
import useResultSubmitUjian from "@/stores/useResultSubmitUjian.ts";
import ExamSubmitResult from "@/components/exam/questionComponent/component/exam-submit-result.tsx";

export default function ExamPage() {
    const timer = useTimerStore((state) => state.timer);
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<Record<number, string | null>>({})
    const [examFinished, setExamFinished] = useState(false)
    const [timeLeft, setTimeLeft] = useState(timer)
    const isMobile = useIsMobile()
    const [openSubmitAlert, setOpenSubmitAlert] = useState<boolean>(false)
    const {soal, readyState, submitUjian, sendJawaban, sendTimer} = useExamSocket();
    const statusList = ['Connecting', 'Online', 'Closing', 'Offline']
    const {benar, salah, kosong, total, nilai} = useResultSubmitUjian()
    
    useEffect(() => {
        if (!soal) return;
        const initialAnswers: Record<number, string | null> = {};
        soal.forEach((question) => {
            initialAnswers[question.id_soal_ujian] = null;
        });
        setAnswers(initialAnswers);
    }, [soal]);
    useEffect(() => {
        sendTimer(timeLeft)
    }, [timeLeft]);
    const handleAnswerChange = (questionId: number, answer: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }))
        console.log(questionId, answer);
        sendJawaban(questionId, answer)
    }
    const handleFinishExam = () => {
        setOpenSubmitAlert(true)
    }
    const allQuestionsAnswered = Object.values(answers).every((a) => a !== null)
    if (examFinished) {
        return (
            <ExamSubmitResult benar={benar} salah={salah} kosong={kosong} total={total} nilai={nilai}/>
            // <div className="container mx-auto py-8 px-4">
            //     <Card className="p-8 text-center">
            //         <h1 className="text-2xl font-bold mb-4">Exam Completed</h1>
            //        
            //         <p className="mb-4">Thank you for completing the exam.</p>
            //         <Button onClick={() => navigate("/result")}>Lihat Detail Hasil</Button>
            //     </Card>
            // </div>
        )
    }
        
        return (
            <div className="container mx-auto py-4 px-2 md:px-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Mobile navigation (top) */}
                    {isMobile && (
                        <Card className="p-4 mb-4 w-full">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-semibold">Questions</h2>
                                <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft}
                                       onTimeUp={() => setExamFinished(true)}/>
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

                    {/* Main content */}
                    <div className={`flex-1 ${!isMobile ? "order-1" : ""}`}>
                        <Card className="p-4 mb-4">
                            <div className="flex justify-between items-center">
                                <h1 className="text-xl font-bold">Exam Questions</h1>
                                <div className="flex items-center gap-2 justify-center">
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
                                    <p
                                        className={`text-xs ${
                                            readyState === 0
                                                ? "text-gray-400"
                                                : readyState === 1
                                                    ? "text-green-500"
                                                    : readyState === 2
                                                        ? "text-yellow-500"
                                                        : "text-red-500"
                                        }`}
                                    >
                                        {statusList[readyState]}
                                    </p>
                                </div>
                                {!isMobile && (
                                    <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft}
                                           onTimeUp={() => setExamFinished(true)}/>
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

                    {/* Desktop navigation (side) */}
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
                            <Button onClick={() => {
                                submitUjian();
                                setOpenSubmitAlert(false);
                                setExamFinished(true)
                            }}>Ya, Submit</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        )
    
}
