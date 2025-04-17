"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import {toast} from "sonner";
import {useIsMobile} from "@/hooks/use-mobile.tsx";

// Define the question types
interface Question {
    id_soal_ujian: number
    pertanyaan: string
    tipe: string
    a?: string
    b?: string
    c?: string
    d?: string
    e?: string
}

// Mock data from the provided JSON
const examData = {
    soal_ujian: [
        {
            id_soal_ujian: 8,
            pertanyaan: "<p>Berapa hasil dari 2 + 2?</p>",
            tipe: "1",
            a: "4",
            b: "7",
            c: "5",
            d: "6",
            e: "3",
        },
        {
            id_soal_ujian: 11,
            pertanyaan:
                '<p>Berapa hasil dari 5 + 5?</p><img src="https://cbt.sman8tamsel.com/public/soal-image/gambar.jpg" />',
            tipe: "1",
            a: "4",
            b: "7",
            c: "5",
            d: "6",
            e: "3",
        },
        {
            id_soal_ujian: 12,
            pertanyaan: "<p>Berapa hasil dari 5 + 5?</p>",
            tipe: "1",
            a: "10",
            b: "13",
            c: "11",
            d: "12",
            e: "9",
        },
        {
            id_soal_ujian: 16,
            pertanyaan:
                '<p>Berapa hasil dari 5 + 5?</p><img src="https://cbt.sman8tamsel.com/public/soal-image/gambar.jpg" />',
            tipe: "1",
            a: "4",
            b: "7",
            c: "5",
            d: "6",
            e: "3",
        },
        {
            id_soal_ujian: 9,
            pertanyaan: "<p>Berapa hasil dari 2 + 2?</p>",
            tipe: "2",
            a: "",
            b: "",
            c: "",
            d: "",
            e: "",
        },
        {
            id_soal_ujian: 13,
            pertanyaan:
                '<p>Berapa hasil dari 5 + 5?</p><img src="https://cbt.sman8tamsel.com/public/soal-image/gambar.jpg" />',
            tipe: "2",
            a: "",
            b: "",
            c: "",
            d: "",
            e: "",
        },
        {
            id_soal_ujian: 14,
            pertanyaan:
                '<p>Berapa hasil dari 5 + 5?</p><img src="https://cbt.sman8tamsel.com/public/soal-image/gambar.jpg" />',
            tipe: "2",
            a: "",
            b: "",
            c: "",
            d: "",
            e: "",
        },
        {
            id_soal_ujian: 5,
            pertanyaan:
                '<p>Berapa hasil dari 5 + 5?</p><img src="https://cbt.sman8tamsel.com/public/soal-image/gambar.jpg" />',
            tipe: "3",
            a: "",
            b: "",
            c: "",
            d: "",
            e: "",
        },
        {
            id_soal_ujian: 15,
            pertanyaan:
                '<p>Berapa hasil dari 5 + 5?</p><img src="https://cbt.sman8tamsel.com/public/soal-image/gambar.jpg" />',
            tipe: "3",
            a: "",
            b: "",
            c: "",
            d: "",
            e: "",
        },
    ],
    history_jawaban: [],
}

export default function ExamPanel() {
    const [currentQuestion, setCurrentQuestion] = useState<number>(0)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [progress, setProgress] = useState<number>(0)
    const isMobile = useIsMobile()

    const questions = examData.soal_ujian

    useEffect(() => {
        // Calculate progress
        const answeredCount = Object.keys(answers).length
        const totalQuestions = questions.length
        setProgress((answeredCount / totalQuestions) * 100)
    }, [answers, questions.length])

    const handleAnswerChange = (questionId: number, answer: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }))
    }

    const handleSubmit = () => {
        if (Object.keys(answers).length < questions.length) {
            toast.warning("Mohon jawab semua pertanyaan sebelum mengirim.")
            return
        }

        toast.success("Ujian Berhasil Dikirim")

        console.log("Submitted answers:", answers)
    }

    const renderQuestionContent = (question: Question) => {
        const questionHtml = { __html: question.pertanyaan }

        return (
            <div className="space-y-4">
                <div dangerouslySetInnerHTML={questionHtml} className="text-lg font-medium" />

                {question.tipe === "1" && (
                    <RadioGroup
                        value={answers[question.id_soal_ujian] || ""}
                        onValueChange={(value) => handleAnswerChange(question.id_soal_ujian, value)}
                        className="space-y-3"
                    >
                        {["a", "b", "c", "d", "e"].map(
                            (option) =>
                                question[option as keyof Question] && (
                                    <div
                                        key={option}
                                        className="flex items-center space-x-2 rounded-lg border p-3 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                                    >
                                        <RadioGroupItem value={option} id={`${question.id_soal_ujian}-${option}`} />
                                        <Label htmlFor={`${question.id_soal_ujian}-${option}`} className="flex-1 cursor-pointer">
                                            {option.toUpperCase()}. {question[option as keyof Question]}
                                        </Label>
                                    </div>
                                ),
                        )}
                    </RadioGroup>
                )}

                {(question.tipe === "2" || question.tipe === "3") && (
                    <Textarea
                        placeholder="Ketik jawaban Anda di sini..."
                        className="min-h-[150px]"
                        value={answers[question.id_soal_ujian] || ""}
                        onChange={(e : any) => handleAnswerChange(question.id_soal_ujian, e.target.value)}
                    />
                )}
            </div>
        )
    }

    const isQuestionAnswered = (questionId: number) => {
        return !!answers[questionId]
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="overflow-hidden">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 border-b">
                    <h1 className="text-2xl font-bold">Ujian Online</h1>
                    <div className="mt-2 flex items-center gap-2">
                        <Progress value={progress} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{Math.round(progress)}%</span>
                    </div>
                </div>

                <div className={`flex ${isMobile ? "flex-col" : "flex-row"} h-full`}>
                    {/* Question navigation */}
                    <div className={`${isMobile ? "w-full p-4 border-b" : "w-1/4 p-4 border-r"} bg-white dark:bg-gray-900`}>
                        <h2 className="text-lg font-semibold mb-4">Nomor Soal</h2>
                        <div className={`grid ${isMobile ? "grid-cols-5 sm:grid-cols-8" : "grid-cols-3"} gap-2`}>
                            {questions.map((question, index) => (
                                <Button
                                    key={question.id_soal_ujian}
                                    variant={currentQuestion === index ? "default" : "outline"}
                                    className={`relative ${isQuestionAnswered(question.id_soal_ujian) ? "border-green-500 dark:border-green-600" : ""}`}
                                    onClick={() => setCurrentQuestion(index)}
                                >
                                    {index + 1}
                                    {isQuestionAnswered(question.id_soal_ujian) && (
                                        <CheckCircle2 className="absolute -top-1 -right-1 h-4 w-4 text-green-500" />
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Question content */}
                    <div className={`${isMobile ? "w-full" : "w-3/4"} p-6`}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Soal {currentQuestion + 1}</h2>
                            <div className="flex items-center gap-2">
                                {isQuestionAnswered(questions[currentQuestion].id_soal_ujian) ? (
                                    <span className="text-green-500 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Terjawab
                  </span>
                                ) : (
                                    <span className="text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" /> Belum Terjawab
                  </span>
                                )}
                            </div>
                        </div>

                        {renderQuestionContent(questions[currentQuestion])}

                        <div className="mt-8 flex justify-between">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                disabled={currentQuestion === 0}
                            >
                                Soal Sebelumnya
                            </Button>

                            {currentQuestion === questions.length - 1 ? (
                                <Button
                                    onClick={handleSubmit}
                                    disabled={Object.keys(answers).length < questions.length}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    Kirim Jawaban
                                </Button>
                            ) : (
                                <Button onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}>
                                    Soal Berikutnya
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fixed submit button for mobile */}
                {isMobile && (
                    <div className="sticky bottom-0 p-4 bg-white dark:bg-gray-900 border-t">
                        <Button
                            onClick={handleSubmit}
                            disabled={Object.keys(answers).length < questions.length}
                            className="w-full bg-green-600 hover:bg-green-700"
                        >
                            Kirim Jawaban ({Object.keys(answers).length}/{questions.length})
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    )
}
