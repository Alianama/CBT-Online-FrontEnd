
import type React from "react"
import { Card } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import type { QuestionType } from "@/types/types.ts"
import MathJax from "./math-jax.tsx"

interface ExamQuestionsProps {
    questions: QuestionType[]
    currentQuestion: number
    onAnswerChange: (questionId: number, answer: string) => void
    answers: Record<number, string | null>
}

export default function ExamQuestions({ questions, currentQuestion, onAnswerChange, answers }: ExamQuestionsProps) {
    const question = questions[currentQuestion]

    if (!question) return <div>No question found</div>

    const handleMultipleChoiceChange = (value: string) => {
        onAnswerChange(question.id_soal_ujian, value)
    }

    const handleTextAnswerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onAnswerChange(question.id_soal_ujian, e.target.value)
    }

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
          <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {currentQuestion + 1}
          </span>
                    <h2 className="text-lg font-semibold">Question</h2>
                </div>

                <Card className="p-4 mb-4">
                    <MathJax>
                        <div dangerouslySetInnerHTML={{ __html: question.pertanyaan }} />
                    </MathJax>
                </Card>

                {question.tipe === "1" && (
                    <div className="space-y-4">
                        <RadioGroup value={answers[question.id_soal_ujian] || question.jawaban || ""} onValueChange={handleMultipleChoiceChange}>
                            {["a", "b", "c", "d", "e"].map((option) => {
                                if (!question[option as keyof QuestionType]) return null

                                return (
                                    <div key={option} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                                        <RadioGroupItem value={option} id={`option-${option}`} className="mt-1" />
                                        <Label htmlFor={`option-${option}`} className="flex-1 cursor-pointer">
                                            <MathJax>
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: question[option as keyof QuestionType] as string,
                                                    }}
                                                />
                                            </MathJax>
                                        </Label>
                                    </div>
                                )
                            })}
                        </RadioGroup>
                    </div>
                )}

                {question.tipe === "2" && (
                    <div className="space-y-4">
                        <Label htmlFor="short-answer">Your Answer:</Label>
                        <Input
                            id="short-answer"
                            value={answers[question.id_soal_ujian] || question.jawaban || ""}
                            onChange={handleTextAnswerChange}
                            placeholder="Type your answer here..."
                            className="w-full"
                        />
                    </div>
                )}

                {question.tipe === "3" && (
                    <div className="space-y-4">
                        <Label htmlFor="essay-answer">Your Answer:</Label>
                        <Textarea
                            id="essay-answer"
                            value={answers[question.id_soal_ujian] || question.jawaban || ""}
                            onChange={handleTextAnswerChange}
                            placeholder="Type your essay answer here..."
                            className="w-full min-h-[300px]"
                        />
                    </div>
                )}
            </div>

            <div className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
            </div>
        </div>
    )
}
