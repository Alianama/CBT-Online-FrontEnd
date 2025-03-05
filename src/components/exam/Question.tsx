"use client"
import {useEffect, useState} from "react"
import {Card, CardContent} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group"
import {Label} from "@/components/ui/label"
import {Progress} from "@/components/ui/progress"
import {AlertCircle} from "lucide-react"
import type {Question} from "@/types/types.ts";
// Sample questions
const questionsData: Question[] = [
    {
        id: 1,
        text: "What is the capital of France?",
        options: [
            {id: "a", text: "London"},
            {id: "b", text: "Berlin"},
            {id: "c", text: "Paris"},
            {id: "d", text: "Madrid"},
        ],
        correctAnswer: "c",
    },
    {
        id: 2,
        text: "Which planet is known as the Red Planet?",
        options: [
            {id: "a", text: "Venus"},
            {id: "b", text: "Mars"},
            {id: "c", text: "Jupiter"},
            {id: "d", text: "Saturn"},
        ],
        correctAnswer: "b",
    },
    {
        id: 3,
        text: "What is the largest ocean on Earth?",
        options: [
            {id: "a", text: "Atlantic Ocean"},
            {id: "b", text: "Indian Ocean"},
            {id: "c", text: "Arctic Ocean"},
            {id: "d", text: "Pacific Ocean"},
        ],
        correctAnswer: "d",
    },
    {
        id: 4,
        text: "Which element has the chemical symbol 'O'?",
        options: [
            {id: "a", text: "Osmium"},
            {id: "b", text: "Oxygen"},
            {id: "c", text: "Oganesson"},
            {id: "d", text: "Olivine"},
        ],
        correctAnswer: "b",
    },
    {
        id: 5,
        text: "Who painted the Mona Lisa?",
        options: [
            {id: "a", text: "Vincent van Gogh"},
            {id: "b", text: "Pablo Picasso"},
            {id: "c", text: "Leonardo da Vinci"},
            {id: "d", text: "Michelangelo"},
        ],
        correctAnswer: "c",
    },
    {
        id: 6,
        text: "What is the capital of France?",
        options: [
            {id: "a", text: "London"},
            {id: "b", text: "Berlin"},
            {id: "c", text: "Paris"},
            {id: "d", text: "Madrid"},
        ],
        correctAnswer: "c",
    },
    {
        id: 7,
        text: "Which planet is known as the Red Planet?",
        options: [
            {id: "a", text: "Venus"},
            {id: "b", text: "Mars"},
            {id: "c", text: "Jupiter"},
            {id: "d", text: "Saturn"},
        ],
        correctAnswer: "b",
    },
    {
        id: 8,
        text: "What is the largest ocean on Earth?",
        options: [
            {id: "a", text: "Atlantic Ocean"},
            {id: "b", text: "Indian Ocean"},
            {id: "c", text: "Arctic Ocean"},
            {id: "d", text: "Pacific Ocean"},
        ],
        correctAnswer: "d",
    },
    {
        id: 9,
        text: "Which element has the chemical symbol 'O'?",
        options: [
            {id: "a", text: "Osmium"},
            {id: "b", text: "Oxygen"},
            {id: "c", text: "Oganesson"},
            {id: "d", text: "Olivine"},
        ],
        correctAnswer: "b",
    },
    {
        id: 10,
        text: "Who painted the Mona Lisa?",
        options: [
            {id: "a", text: "Vincent van Gogh"},
            {id: "b", text: "Pablo Picasso"},
            {id: "c", text: "Leonardo da Vinci"},
            {id: "d", text: "Michelangelo"},
        ],
        correctAnswer: "c",
    },
]
export default function ExamInterface() {
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
    const [examStarted, setExamStarted] = useState(false)
    // Shuffle questions when exam starts
    useEffect(() => {
        if (examStarted) {
            const shuffled = [...questionsData].sort(() => Math.random() - 0.5)
            setQuestions(shuffled)
            setTimeLeft(300)
            setAnswers({})
        }
    }, [examStarted])
    // Countdown timer
    useEffect(() => {
        if (!examStarted || timeLeft <= 0) return
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [examStarted, timeLeft])
    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    // Calculate completion percentage
    const completionPercentage = questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0
    // Handle answer selection
    const handleAnswerSelect = (questionId: number, answerId: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answerId,
        }))
    }
    // Navigation functions
    const goToNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1)
        }
    }
    const goToPrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1)
        }
    }
    const goToQuestion = (index: number) => {
        if (index >= 0 && index < questions.length) {
            setCurrentQuestionIndex(index)
        }
    }
    // Start exam handler
    const startExam = () => {
        setExamStarted(true)
        setCurrentQuestionIndex(0) // Reset to the first question
    }
    // End exam handler
    const endExam = () => {
        console.log(answers)
        setExamStarted(false)
    }
    if (!examStarted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Card className="w-full max-w-lg">
                    <CardContent className="p-6">
                        <h1 className="text-2xl font-bold mb-4 text-center">Online Examination</h1>
                        <p className="mb-6 text-center text-muted-foreground">
                            This exam contains {questionsData.length} multiple-choice questions. You will have 5 minutes
                            to complete
                            the exam.
                        </p>
                        <Button onClick={startExam}
                                className="w-full bg-primary hover:bg-primary/90 text-secondary">
                            Start Exam
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }
    if (timeLeft === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Card className="w-full max-w-lg">
                    <CardContent className="p-6">
                        <h1 className="text-2xl font-bold mb-4 text-center">Time's Up!</h1>
                        <p className="mb-6 text-center text-muted-foreground">
                            You've answered {Object.keys(answers).length} out of {questions.length} questions.
                        </p>
                        <Button onClick={startExam}
                                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                            Restart Exam
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }
    if (questions.length === 0) {
        return <div>Loading questions...</div>
    }
    const currentQuestion = questions[currentQuestionIndex]
    return (
        <div className="max-w-3xl mx-auto">
            {/* Header with timer and progress */}
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                    <AlertCircle className="h-5 w-5 text-red-500"/>
                    <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                </div>
                <div className="flex flex-col w-full sm:w-auto gap-2">
                    <div className="flex items-center gap-2">
                        <span
                            className="text-sm text-muted-foreground">Completion: {Math.round(completionPercentage)}%</span>
                        <span className="text-sm text-muted-foreground">
              ({Object.keys(answers).length}/{questions.length})
            </span>
                    </div>
                    <Progress value={completionPercentage} className="w-full sm:w-[200px]"/>
                </div>
            </div>

            {/* Question number navigation */}
            <div className="mb-6 flex flex-wrap gap-2 justify-center">
                {questions.map((q: Question, index: number) => (
                    <Button
                        key={q.id}
                        variant="default"
                        className={`w-10 h-10 p-0 ${answers[q.id] ? " border-green dark:border-green border-2" : " bg-secondary text-sidebar-primary"} ${
                            index === currentQuestionIndex && !answers[q.id] ? "hover:dark:bg-primary hover:dark:text-secondary bg-primary dark:bg-secondary dark:text-primary text-secondary" : ""
                        }`}
                        onClick={() => goToQuestion(index)}
                    >
                        {index + 1}
                    </Button>
                ))}
            </div>

            {/* Current question */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </h2>
                        <p className="text-lg">{currentQuestion.text}</p>
                    </div>

                    <RadioGroup
                        value={answers[currentQuestion.id] || ""}
                        onValueChange={(value: string) => handleAnswerSelect(currentQuestion.id, value)}
                        className="space-y-3"
                    >
                        {currentQuestion.options.map((option) => (
                            <div
                                key={option.id}
                                className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${
                                    answers[currentQuestion.id] === option.id ? "bg-accent/20 border-accent" : "hover:bg-muted"
                                }`}
                                onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                            >
                                <RadioGroupItem value={option.id} id={`option-${option.id}`}/>
                                <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer font-medium">
                                    <span className="font-semibold mr-2">{option.id.toUpperCase()}.</span>
                                    {option.text}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </CardContent>
            </Card>

            {/* Navigation buttons */}
            <div className="flex justify-between pb-10">
                <Button
                    variant="outline"
                    onClick={goToPrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="border-accent/50 bg-thrid text-secondary hover:bg-thrid/80 hover:text-secondary"
                >
                    Previous
                </Button>

                <Button
                    variant="default"
                    onClick={endExam}
                    className="border-accent/50 bg-forty hover:bg-forty/80 text-secondary "
                >
                    Submit
                </Button>

                <Button
                    variant="default"
                    onClick={goToNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="bg-primary hover:bg-primary/80 text-secondary"
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

