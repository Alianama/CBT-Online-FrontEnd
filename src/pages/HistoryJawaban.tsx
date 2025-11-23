import  { useState, useEffect, useContext } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { getHistoriJawaban } from "@/app/api/api-cbt"
import { useNavigate, useParams } from "react-router-dom"
import Layout from "@/components/sidebar/Layout"
import LanguageContext from "@/context/LanguageContext"
import { Button } from "@/components/ui/button"
import HTMLWithImagePreview from "@/components/exam/questionComponent/component/SafeHTMLWithImagePreview.tsx";

export default function ExamResults() {
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([])
  const [examData, setExamData] = useState<any>(null)
  const { id } = useParams()
  const [isError, setIsError] = useState<boolean>(false)
  const { locale } = useContext(LanguageContext)
  const safeLocale = locale === "id" || locale === "en" ? locale : "en"
  const navigate = useNavigate()

  const translations = {
    id: {
      pageTitle: "Hasil Ujian",
      studentInfo: "Peserta Ujian",
      examResult: "Hasil Ujian",
      passed: "Lulus",
      notPassed: "Tidak Lulus",
      score: "Nilai",
      correct: "Benar",
      wrong: "Salah",
      empty: "Kosong",
      examType: "Jenis Ujian",
      subject: "Ujian",
      start: "Mulai",
      end: "Submit",
      questionDetail: "Detail Soal",
      all: "Semua",
      back: "Kembali",
      errorTitle: "Ops..",
      errorDesc: "Maaf, hasil ujian disembunyikan dari siswa.",
      loading: "Memuat hasil ujian...",
      yourAnswer: "Jawaban Anda",
      yourAnswerCorrect: "Jawaban Anda (Benar)",
      correctAnswer: "Kunci Jawaban",
      question: "Soal",
      scoreLabel: "Skor",
      answerHistory: "Histori Jawaban",
      congrats: "Selamat! Anda telah lulus ujian ini.",
      sorry: "Maaf, Anda belum lulus ujian ini.",
      kkmLabel: "KKM",
    },
    en: {
      pageTitle: "Exam Result",
      studentInfo: "Student Information",
      examResult: "Exam Result",
      passed: "Passed",
      notPassed: "Failed",
      score: "Score",
      correct: "Correct",
      wrong: "Wrong",
      empty: "Empty",
      examType: "Exam Type",
      subject: "Subject",
      start: "Start",
      end: "End",
      questionDetail: "Question Details",
      all: "All",
      back: "Back",
      errorTitle: "An Error Occurred",
      errorDesc: "Sorry, please try again later.",
      loading: "Loading exam results...",
      yourAnswer: "Your Answer",
      yourAnswerCorrect: "Your Answer (Correct)",
      correctAnswer: "Correct Answer",
      question: "Question",
      scoreLabel: "Score",
      answerHistory: "Answer History",
      congrats: "Congratulations! You passed the exam.",
      sorry: "Sorry, you did not pass the exam.",
      kkmLabel: "Pass Grade",
    },
  }

  const t = translations[safeLocale]

  const pageData: Record<"id" | "en", { name: string; url: string }[]> = {
    id: [
      { name: "Hasil Ujian", url: "/result" },
      { name: "Histori Jawaban", url: "#" },
    ],
    en: [
      { name: "Exam Result", url: "/result" },
      { name: "Answer History", url: "#" },
    ],
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getHistoriJawaban(id)
        setExamData(response)
        setIsError(false)
      } catch (error) {
        console.error("Gagal memuat data ujian:", error)
        setIsError(true)
      }
    }

    fetchData()
  }, [id])



  const toggleQuestion = (id: number) => {
    setExpandedQuestions((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id]
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString(safeLocale === "id" ? "id-ID" : "en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isError) {
    return (
      <Layout data={pageData[safeLocale]}>
        <div className="flex flex-col items-center justify-center h-screen space-y-4 text-center">
          <XCircle className="h-16 w-16 text-primary animate-pulse" />
          <h2 className="text-3xl font-bold text-primary mb-2">{t.errorTitle}</h2>
          <p className="text-xs text-gray-700 mb-4">{t.errorDesc}</p>
          <Button
            onClick={() => navigate("/result")}
            className="bg-primary text-white hover:bg-red-600 transition-all duration-200"
          >
            {t.back}
          </Button>
        </div>
      </Layout>
    )
  }

  if (!examData) {
    return (
      <Layout data={pageData[safeLocale]}>
        <div className="container mx-auto py-6 px-4 md:px-6 flex flex-col items-center justify-center animate-pulse">
          <div className="loader"></div>
          <h1 className="text-2xl font-bold mt-4 animate-blink">{t.loading}</h1>
        </div>
      </Layout>
    )
  }


  const { info_ujian, soal_ujian } = examData
  const totalQuestions = (info_ujian?.benar || 0) + (info_ujian?.salah || 0) + (info_ujian?.kosong || 0)
  return (
    <Layout data={pageData[safeLocale]}>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">{t.pageTitle}</h1>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t.studentInfo}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {[
                  ["NIS", info_ujian.nis],
                  ["Nama", info_ujian.nama_siswa],
                  [t.examType, info_ujian.jenis_ujian],
                  [t.subject, info_ujian.nama_bank],
                  [t.start, formatDate(info_ujian.mulai)],
                  [t.end, formatDate(info_ujian.submit)],
                ].map(([label, value]) => (
                  <div className="flex justify-between" key={label}>
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t.examResult}</CardTitle>
              <CardDescription>
                {info_ujian.nilai >= info_ujian.kkm ? t.congrats : t.sorry}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">{t.score}</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          info_ujian.nilai >= info_ujian.kkm ? "default" : "destructive"
                        }
                      >
                        {info_ujian.nilai >= info_ujian.kkm ? t.passed : t.notPassed}
                      </Badge>
                      <span className="text-2xl font-bold">{info_ujian.nilai}</span>
                    </div>
                  </div>
                  <Progress value={(info_ujian.nilai / 100) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>{t.kkmLabel}: {info_ujian.kkm}</span>
                    <span>100</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    {
                      icon: <CheckCircle className="h-5 w-5 text-green-500 mb-1" />,
                      label: t.correct,
                      value: info_ujian.benar,
                      bg: "bg-green-50 dark:bg-green-950",
                    },
                    {
                      icon: <XCircle className="h-5 w-5 text-red-500 mb-1" />,
                      label: t.wrong,
                      value: info_ujian.salah,
                      bg: "bg-red-50 dark:bg-red-950",
                    },
                    {
                      icon: <AlertCircle className="h-5 w-5 text-gray-500 mb-1" />,
                      label: t.empty,
                      value: info_ujian.kosong,
                      bg: "bg-gray-50 dark:bg-gray-900",
                    },
                  ].map((item, i) => (
                    <div key={i} className={`flex flex-col items-center p-3 rounded-lg ${item.bg}`}>
                      {item.icon}
                      <span className="text-xl font-bold">{item.value}</span>
                      <span className="text-xs text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            {t.questionDetail} ({totalQuestions})
          </h2>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">{t.all}</TabsTrigger>
              <TabsTrigger value="correct">{t.correct}</TabsTrigger>
              <TabsTrigger value="wrong">{t.wrong}</TabsTrigger>
            </TabsList>

            {["all", "correct", "wrong"].map((tab) => {
              const filter = {
                all: () => true,
                correct: (s: any) => s.koreksi === 1,
                wrong: (s: any) => s.koreksi === 0,
              }[tab]

              return (
                <TabsContent key={tab} value={tab} className="space-y-4">
                  {soal_ujian.filter(filter).map((soal: any, index: number) => {
                    const isExpanded = expandedQuestions.includes(soal.id_soal_ujian)
                    const correct = soal.koreksi === 1

                    return (
                      <Card key={soal.id_soal_ujian}>
                        <div className="flex items-center justify-between p-4 cursor-pointer"
                          onClick={() => toggleQuestion(soal.id_soal_ujian)}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${correct ? "bg-green-500" : "bg-red-500"}`}>
                              {index + 1}
                            </div>
                            <span className="font-medium">{t.question} {index + 1}</span>
                            <Badge variant="outline"
                              className={` dark:text-black ${correct ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                              {correct ? t.correct : t.wrong}
                            </Badge>
                            <Badge variant="secondary" className="ml-2">
                              {t.scoreLabel}: {soal.skor}
                            </Badge>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </div>

                        {isExpanded && (
                          <div className="px-4 pb-4">
                            <Separator className="mb-4" />
                            <div className="space-y-4">
                              <HTMLWithImagePreview html={soal.pertanyaan} />

                              <div className="grid gap-2">
                                {soal.tipe === "3" ? (
                                    // Render untuk soal tipe 3 (jawaban berupa gambar)
                                    <div className="flex flex-col p-3 rounded-md border bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
                                      <div className="mb-2">
                                        <strong>{t.yourAnswer}:</strong>
                                        <div className="mt-1 p-2 rounded bg-gray-100 dark:bg-gray-800">
                                          {soal.jawaban ? (
                                              <img src={soal.jawaban} alt="Jawaban Anda" className="max-w-full h-auto rounded" />
                                          ) : (
                                              <em>({t.empty})</em>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                ) : soal.tipe === "2" ? (
                                    // Render untuk soal tipe 2 (isian/essay)
                                    <div className="flex flex-col p-3 rounded-md border bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
                                      <div className="mb-2">
                                        <strong>{t.yourAnswer}:</strong>
                                        <div
                                          className={`mt-1 p-2 rounded ${
                                            correct
                                              ? "bg-green-100 text-green-800"
                                              : "bg-red-100 text-red-800"
                                          }`}
                                        >
                                          <HTMLWithImagePreview html={soal.jawaban || `<em>(${t.empty})</em>`} />
                                        </div>
                                      </div>
                                      {soal.kunci_jawaban && (
                                        <div className="mt-2">
                                          <strong>{t.correctAnswer}:</strong>
                                          <div className="mt-1 p-2 rounded bg-green-50 text-green-900">
                                            <HTMLWithImagePreview html={soal.kunci_jawaban} />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                ) : (
                                    // Render untuk soal pilihan ganda
                                    ["a", "b", "c", "d", "e"].map((option) => {
                                      const isCorrect = soal.kunci_jawaban?.toLowerCase() === option;
                                      const isSelected = soal.jawaban?.toLowerCase() === option;
                                      const hasAnswer = soal[option] && soal[option].trim() !== "";

                                      if (!hasAnswer) return null;

                                      let optionClass = "flex items-start p-3 rounded-md border";
                                      if (isCorrect) {
                                        optionClass += " bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800";
                                      } else if (isSelected) {
                                        optionClass += " bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800";
                                      }

                                      return (
                                          <div key={option} className={optionClass}>
                                            <div className="mr-3">
                                              <div
                                                  className={`w-6 h-6 flex items-center justify-center rounded-full border ${
                                                      isCorrect
                                                          ? "bg-green-500 text-white border-green-500"
                                                          : isSelected
                                                              ? "bg-red-500 text-white border-red-500"
                                                              : "border-gray-300"
                                                  }`}
                                              >
                                                {option.toUpperCase()}
                                              </div>
                                            </div>
                                            <div className="flex-grow">
                                              <HTMLWithImagePreview html={soal[option]} />
                                            </div>
                                            <div className="ml-2">
                                              {isCorrect && (
                                                  <Badge className="bg-green-100 text-green-800 border-green-200">{t.correctAnswer}</Badge>
                                              )}
                                              {isSelected && !isCorrect && (
                                                  <Badge className="bg-red-100 text-red-800 border-red-200">{t.yourAnswer}</Badge>
                                              )}
                                              {isSelected && isCorrect && (
                                                  <Badge className="bg-green-100 text-green-800 border-green-200">{t.yourAnswerCorrect}</Badge>
                                              )}
                                            </div>
                                          </div>
                                      );
                                    })
                                )}
                              </div>

                            </div>
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </TabsContent>
              )
            })}
          </Tabs>
        </div>
      </div>
    </Layout>
  )
}
