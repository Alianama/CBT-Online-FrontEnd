import { useState } from "react"
import { CircleCheck, CircleX, CircleDashed, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

export default function ExamSubmitResult({benar, salah, kosong, total, nilai} : {benar: number, salah: number, kosong: number, total: number, nilai: number}) {
    const [open, setOpen] = useState(false)


    const correctPercentage = (benar / total) * 100
    const incorrectPercentage = (salah / total) * 100
    const unansweredPercentage = (kosong / total) * 100

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-bold text-center">Hasil Ujian</CardTitle>
                    <CardDescription className="text-center">Ringkasan performa ujian Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-center">
                        <div className="relative w-36 h-36 flex items-center justify-center">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke="#22c55e"
                                    strokeWidth="10"
                                    strokeDasharray={`${nilai * 2.83} 283`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 50 50)"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center">
                                <span className="text-4xl font-bold">{nilai}</span>
                                <span className="text-sm text-gray-500">Nilai</span>
                            </div>
                        </div>
                    </div>

                    {/* Results breakdown */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <CircleCheck className="w-5 h-5 text-green-500 mr-2" />
                                    <span>Jawaban Benar</span>
                                </div>
                                <span className="font-semibold">
                  {benar} dari {total}
                </span>
                            </div>
                            <Progress value={correctPercentage} className="h-2 bg-gray-200" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <CircleX className="w-5 h-5 text-red-500 mr-2" />
                                    <span>Jawaban Salah</span>
                                </div>
                                <span className="font-semibold">
                  {salah} dari {total}
                </span>
                            </div>
                            <Progress value={incorrectPercentage} className="h-2 bg-gray-200"  />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <CircleDashed className="w-5 h-5 text-gray-500 mr-2" />
                                    <span>Tidak Dijawab</span>
                                </div>
                                <span className="font-semibold">
                  {kosong} dari {total}
                </span>
                            </div>
                            <Progress value={unansweredPercentage} className="h-2 bg-gray-200"  />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full">
                                Lihat Detail Hasil Ujian
                                <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Detail Hasil Ujian</DialogTitle>
                                <DialogDescription>Analisis lengkap dari performa ujian Anda</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500">Total Soal</p>
                                        <p className="text-xl font-bold">{total}</p>
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-lg">
                                        <p className="text-sm text-gray-500">Nilai Akhir</p>
                                        <p className="text-xl font-bold">{nilai}</p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <p className="text-sm text-green-600">Jawaban Benar</p>
                                        <p className="text-xl font-bold text-green-600">{benar}</p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <p className="text-sm text-red-600">Jawaban Salah</p>
                                        <p className="text-xl font-bold text-red-600">{salah}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                                        <p className="text-sm text-gray-500">Tidak Dijawab</p>
                                        <p className="text-xl font-bold">{kosong}</p>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <p className="text-sm text-gray-500 mb-2">Distribusi Jawaban per Kategori</p>
                                    <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <p className="text-gray-400">Data detail akan ditampilkan di sini</p>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardFooter>
            </Card>
        </div>
    )
}
