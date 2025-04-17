//
// // import React, { useState } from 'react';
// import { useExamSocket } from '@/hooks/useExamSocket';
// import {useNavigate, useParams} from "react-router-dom";
//
// // type MessageData = {
// //     [key: string]: any;
// // };
//
// const ExamSocketViewer = () => {
//     const navigate = useNavigate();
//     const { token } = useParams<{ token: string }>( );
//     const { lastJsonMessage,dataUjian, sendJsonMessage, readyState } = useExamSocket(token ?? "");
//     // const [messages, setMessages] = useState<MessageData[]>([]);
//     // React.useEffect(() => {
//     //     if (lastJsonMessage) {
//     //         setMessages((prev) => [...prev, lastJsonMessage]);
//     //     }
//     // }, [lastJsonMessage]);
//
//     const statusList = ['Connecting', 'Open', 'Closing', 'Closed'];
//
//     return (
//         <div className="p-4 border rounded max-w-2xl mx-auto bg-white shadow">
//             <h2 className="text-xl font-bold mb-4">🧠 Exam Socket Viewer</h2>
//             <p className="mb-2 text-sm text-gray-600">
//                 Status: <strong>{statusList[readyState]}</strong>
//             </p>
//             <div>
//                 <h1>{dataUjian?.nama_bank}</h1>
//                 <h1>{dataUjian?.nama_siswa}</h1>
//                 <p>tanggal mulai {dataUjian?.mulai} </p>
//                 <p>Durasi Ujian {dataUjian?.durasi_ujian} </p>
//                 <p>Durasi Ujian {dataUjian?.sisa_timer} </p>
//
//
//             </div>
//
//           {/*  <div className="h-64 overflow-y-auto bg-gray-100 p-2 mb-4 rounded text-sm">*/}
//           {/*      {messages.length === 0 && <p className="text-gray-500">Belum ada data masuk.</p>}*/}
//           {/*      {messages.map((msg, idx) => (*/}
//           {/*          <pre key={idx} className="mb-2 bg-white p-2 rounded border">*/}
//           {/*  {JSON.stringify(msg, null, 2)}*/}
//           {/*</pre>*/}
//           {/*      ))}*/}
//           {/*  </div>*/}
//
//             <button
//                 onClick={() => {
//                     sendJsonMessage({type: "soal"});
//                     navigate(`/exam/start/${dataUjian?.nama_bank}`);
//                 }}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
//             >
//                 Mulai
//             </button>
//         </div>
//     );
// };
//
// export default ExamSocketViewer;

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {useExamSocket}  from '@/hooks/useExamSocket'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { useIsMobile } from '@/hooks/use-mobile'

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

export default function ExamPanel() {
    const { token } = useParams<{ token: string }>()
    const { dataUjian, sendJsonMessage, soal, readyState } = useExamSocket(token ?? '')
    const [isStarted, setIsStarted] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState<number>(0)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [progress, setProgress] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(false)
    const isMobile = useIsMobile()

    const questions = soal?.soal_ujian || []

    useEffect(() => {
        const answeredCount = Object.keys(answers).length
        const totalQuestions = questions.length
        setProgress((answeredCount / totalQuestions) * 100)
    }, [answers, questions.length])

    useEffect(() => {
       
            console.log(soal?.soal_ujian)
            setIsStarted(true)
            setIsLoading(false)
        
    }, [])

    const handleAnswerChange = (questionId: number, answer: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answer,
        }))
    }

    const handleStart = () => {
        setIsLoading(true)
        sendJsonMessage({ type: 'soal' })
    }

    const handleSubmit = () => {
        if (Object.keys(answers).length < questions.length) {
            toast.error('Mohon jawab semua pertanyaan sebelum mengirim.')
            return
        }

        toast.success('Ujian Berhasil Dikirim')
        console.log('Submitted answers:', answers)
    }

    const renderQuestionContent = (question: Question) => {
        const questionHtml = { __html: question.pertanyaan }

        return (
            <div className="space-y-4">
                <div dangerouslySetInnerHTML={questionHtml} className="text-lg font-medium" />

                {question.tipe === '1' && (
                    <RadioGroup
                        value={answers[question.id_soal_ujian] || ''}
                        onValueChange={(value) => handleAnswerChange(question.id_soal_ujian, value)}
                        className="space-y-3"
                    >
                        {['a', 'b', 'c', 'd', 'e'].map((option) =>
                            question[option as keyof Question] ? (
                                <div
                                    key={option}
                                    className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-gray-100"
                                >
                                    <RadioGroupItem value={option} id={`${question.id_soal_ujian}-${option}`} />
                                    <Label htmlFor={`${question.id_soal_ujian}-${option}`} className="flex-1 cursor-pointer">
                                        {option.toUpperCase()}. {question[option as keyof Question]}
                                    </Label>
                                </div>
                            ) : null
                        )}
                    </RadioGroup>
                )}

                {(question.tipe === '2' || question.tipe === '3') && (
                    <Textarea
                        placeholder="Ketik jawaban Anda di sini..."
                        className="min-h-[150px]"
                        value={answers[question.id_soal_ujian] || ''}
                        onChange={(e) => handleAnswerChange(question.id_soal_ujian, e.target.value)}
                    />
                )}
            </div>
        )
    }

    const statusList = ['Connecting', 'Open', 'Closing', 'Closed']

    if (!isStarted || !soal?.soal_ujian) {
        return (
            <div className="p-6 text-center max-w-xl mx-auto">
                <h2 className="text-2xl font-bold mb-2">🧠 Persiapan Ujian</h2>
                <p className="text-gray-600 mb-4">Status WebSocket: <strong>{statusList[readyState]}</strong></p>
                {dataUjian && (
                    <div className="text-left mb-4">
                        <p>Nama Bank: <strong>{dataUjian.nama_bank}</strong></p>
                        <p>Nama Siswa: <strong>{dataUjian.nama_siswa}</strong></p>
                        <p>Mulai: {dataUjian.mulai}</p>
                        <p>Durasi: {dataUjian.durasi_ujian} menit</p>
                    </div>
                )}
                <Button onClick={handleStart} disabled={readyState !== 1 || isLoading}>
                    {isLoading ? 'Memuat Soal...' : 'Mulai Ujian'}
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="overflow-hidden">
                <div className="p-4 bg-gray-100 border-b">
                    <h1 className="text-2xl font-bold">Ujian: {dataUjian?.nama_bank}</h1>
                    <div className="mt-2 flex items-center gap-2">
                        <Progress value={progress} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{Math.round(progress)}%</span>
                    </div>
                </div>

                <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'}`}>
                    <div className={`${isMobile ? 'w-full' : 'w-3/4'} p-4`}>
                        {renderQuestionContent(questions[currentQuestion])}
                        <div className="flex justify-between mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setCurrentQuestion((q) => Math.max(q - 1, 0))}
                                disabled={currentQuestion === 0}
                            >
                                Sebelumnya
                            </Button>
                            <Button
                                onClick={() =>
                                    currentQuestion < questions.length - 1
                                        ? setCurrentQuestion((q) => q + 1)
                                        : handleSubmit()
                                }
                            >
                                {currentQuestion < questions.length - 1 ? 'Selanjutnya' : 'Kirim Ujian'}
                            </Button>
                        </div>
                    </div>
                    {!isMobile && (
                        <div className="w-1/4 border-l p-4 space-y-2 bg-gray-50">
                            {questions.map((q, index) => (
                                <Button
                                    key={q.id_soal_ujian}
                                    className="w-full"
                                    onClick={() => setCurrentQuestion(index)}
                                >
                                    Soal {index + 1}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}
