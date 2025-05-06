import {useState, useEffect, useContext, useCallback} from "react"
import {ChevronLeft, ChevronRight, Eye, Loader2} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Badge} from "@/components/ui/badge"
import Layout from "@/components/sidebar/Layout"
import LanguageContext from "@/context/LanguageContext"
import {getHasilUjian} from "@/app/api/api-cbt"
import {useNavigate} from "react-router-dom"

interface ExamResult {
    id_peserta: number
    benar: number
    salah: number
    nilai: number
    kkm: number
    mulai: string
    submit: string
    jenis_ujian: string
    nama_bank: string
    histori_ujian: number
}

interface ApiResponse {
    total: number
    page: number
    limit: number
    data: ExamResult[]
}

type Locale = "id" | "en"
const pageMeta: Record<Locale, { name: string; url: string }> = {
    id: {name: "Hasil Ujian", url: "/"},
    en: {name: "Exam Result", url: "/"},
}
const translations: Record<Locale, Record<string, string>> = {
    id: {
        pageTitle: "Hasil Ujian Siswa",
        loading: "Memuat data...",
        error: "Gagal memuat data. Silakan coba lagi.",
        examName: "Nama Ujian",
        score: "Nilai",
        status: "Status",
        time: "Waktu",
        action: "Aksi",
        correct: "Benar",
        wrong: "Salah",
        passed: "Lulus",
        failed: "Tidak Lulus",
        duration: "Durasi",
        show: "Tampilkan",
        page: "Halaman",
        of: "dari",
        prevPage: "Halaman sebelumnya",
        nextPage: "Halaman berikutnya",
        examDetail: "Detail Hasil Ujian",
        examInfo: "Detail Ujian",
        answerHistory: "Riwayat Jawaban Ujian",
        noHistory: "Tidak ada riwayat ujian sebelumnya",
        participantId: "ID Peserta",
        examType: "Jenis Ujian",
        bankName: "Nama Bank Soal",
        startTime: "Waktu Mulai",
        endTime: "Waktu Selesai",
        kkmLabel: "Nilai KKM",
        viewDetail: "Detail",
        viewHistory: "History Jawaban",
        description:
            "Menampilkan informasi lengkap tentang kinerja siswa dalam ujian, termasuk nilai, durasi, dan riwayat jawaban.",
    },
    en: {
        pageTitle: "Student Exam Results",
        loading: "Loading data...",
        error: "Failed to load data. Please try again.",
        examName: "Exam Name",
        score: "Score",
        status: "Status",
        time: "Time",
        action: "Action",
        correct: "Correct",
        wrong: "Wrong",
        passed: "Passed",
        failed: "Failed",
        duration: "Duration",
        show: "Show",
        page: "Page",
        of: "of",
        prevPage: "Previous page",
        nextPage: "Next page",
        examDetail: "Exam Result Details",
        examInfo: "Exam Detail",
        answerHistory: "Answer History",
        noHistory: "No previous exam history",
        participantId: "Participant ID",
        examType: "Exam Type",
        bankName: "Question Bank Name",
        startTime: "Start Time",
        endTime: "End Time",
        kkmLabel: "Minimum Passing Grade",
        viewDetail: "Detail",
        viewHistory: "Answer history",
        description:
            "Displays complete information about student performance in exams, including grades, duration, and answer history.",
    },
}
export default function ExamResultsPage() {
    const [results, setResults] = useState<ApiResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate();
    const {locale} = useContext(LanguageContext)
    const pagedata = pageMeta[(locale as Locale) ?? "id"]
    const t = translations[(locale as Locale) ?? "id"]
    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await getHasilUjian(page, limit)
            setResults(response)
        } catch (err) {
            setError(t.error)
            console.error("Error fetching exam results:", err)
        } finally {
            setLoading(false)
        }
    }, [page, limit, t.error])
    useEffect(() => {
        fetchData()
    }, [fetchData])
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }
    const calculateDuration = (start: string, end: string) => {
        const startTime = new Date(start).getTime()
        const endTime = new Date(end).getTime()
        const durationMs = endTime - startTime
        const hours = Math.floor(durationMs / 3600000)
        const minutes = Math.floor((durationMs % 3600000) / 60000)
        const seconds = Math.floor((durationMs % 60000) / 1000)
        return `${hours}h ${minutes}m ${seconds}s`
    }
    const totalPages = results ? Math.ceil(results.total / limit) : 1
    return (
        <Layout data={[pagedata]}>
            <div className="container mx-auto py-8 px-4">
                <Card className="w-full shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-2xl font-bold">{t.pageTitle}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-6">
                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                                    <span className="ml-2 text-muted-foreground">{t.loading}</span>
                                </div>
                            ) : error ? (
                                <div className="text-center text-red-500 py-8">{error}</div>
                            ) : (
                                <>
                                    {/* Replace the existing Table with this mobile-friendly version */}
                                    <div className="rounded-md border">
                                        <div className="hidden sm:block overflow-x-auto">
                                            <Table>
                                                <TableHeader className="bg-muted/50">
                                                    <TableRow>
                                                        <TableHead>{t.examName}</TableHead>
                                                        <TableHead>{t.score}</TableHead>
                                                        <TableHead>{t.status}</TableHead>
                                                        <TableHead>{t.time}</TableHead>
                                                        <TableHead className="text-center">{t.action}</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {results?.data.map((result) => {
                                                        const isLulus = result.nilai >= result.kkm
                                                        return (
                                                            <TableRow key={result.id_peserta}
                                                                      className="hover:bg-muted/30">
                                                                <TableCell>
                                                                    <div className="flex flex-col">
                                                                        <span>{result.jenis_ujian}</span>
                                                                        <span
                                                                            className="text-xs text-muted-foreground truncate max-w-[200px]">
                                      {result.nama_bank}
                                    </span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex flex-col">
                                                                        <span
                                                                            className={isLulus ? "text-primary font-semibold" : "text-red-500 font-semibold"}>{result.nilai}</span>
                                                                        <span className="text-xs text-muted-foreground">
                                      {t.correct}: {result.benar} | {t.wrong}: {result.salah}
                                    </span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge
                                                                        className={isLulus ? "bg-primary" : "bg-red-500"}>
                                                                        {isLulus ? t.passed : t.failed}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div
                                                                        className="flex flex-col text-xs text-muted-foreground">
                                                                        <span>{formatDate(result.mulai)}</span>
                                                                        {/*<span>{t.duration}: {calculateDuration(result.mulai, result.submit)}</span>*/}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => navigate(`/result/answer/${result.id_peserta}`)}
                                                                        className="h-8 p-3"
                                                                    >
                                                                        <Eye className="h-4 w-4"/> {t.viewDetail}
                                                                        <span className="sr-only">{t.viewDetail}</span>
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {/* Mobile card view */}
                                        <div className="sm:hidden">
                                            {results?.data.map((result) => {
                                                const isLulus = result.nilai >= result.kkm
                                                return (
                                                    <div key={result.id_peserta} className="border-b p-4">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <div className="font-medium">{result.jenis_ujian}</div>
                                                                <div
                                                                    className="text-xs text-muted-foreground">{result.nama_bank}</div>
                                                            </div>
                                                            <Badge className={isLulus ? "bg-primary" : "bg-red-500"}>
                                                                {isLulus ? t.passed : t.failed}
                                                            </Badge>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                                            <div>
                                                                <div
                                                                    className="text-xs text-muted-foreground">{t.score}</div>
                                                                <div
                                                                    className={isLulus ? "text-primary font-semibold" : "text-red-500 font-semibold"}>{result.nilai}</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {t.correct}: {result.benar} | {t.wrong}: {result.salah}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div
                                                                    className="text-xs text-muted-foreground">{t.time}</div>
                                                                <div
                                                                    className="text-xs">{formatDate(result.mulai)}</div>
                                                                <div className="text-xs text-muted-foreground">
                                                                    {t.duration}: {calculateDuration(result.mulai, result.submit)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-5">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => navigate(`/result/answer/${result.id_peserta}`)}
                                                                className="w-full justify-center bg-slate-300/30"
                                                            >
                                                                <Eye className="h-4 w-4"/> {t.viewDetail}
                                                                <span className="sr-only">{t.viewDetail}</span>
                                                            </Button>

                                                        </div>

                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div
                                            className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
                                            <p className="text-sm text-muted-foreground">{`${t.page} ${page} ${t.of} ${totalPages}`}</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm text-muted-foreground">{t.show}:</p>
                                                <Select
                                                    value={limit.toString()}
                                                    onValueChange={(value) => {
                                                        setLimit(Number(value))
                                                        setPage(1)
                                                    }}
                                                >
                                                    <SelectTrigger className="w-[70px] h-8">
                                                        <SelectValue placeholder="10"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[5, 10, 20, 50].map((num) => (
                                                            <SelectItem key={num} value={num.toString()}>
                                                                {num}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPage(Math.max(1, page - 1))}
                                                disabled={page <= 1}
                                                className="h-8 w-8 p-0"
                                            >
                                                <ChevronLeft className="h-4 w-4"/>
                                                <span className="sr-only">{t.prevPage}</span>
                                            </Button>
                                            <span className="text-sm font-medium">{page}</span>
                                            <span className="text-sm text-muted-foreground">/ {totalPages}</span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                                disabled={page >= totalPages}
                                                className="h-8 w-8 p-0"
                                            >
                                                <ChevronRight className="h-4 w-4"/>
                                                <span className="sr-only">{t.nextPage}</span>
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    )
}
