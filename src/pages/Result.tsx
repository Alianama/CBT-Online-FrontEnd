// import { useState, useEffect, useContext, useCallback } from "react"
// import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// import Layout from "@/components/sidebar/Layout"
// import LanguageContext from "@/context/LanguageContext"
// import { getHasilUjian } from "@/app/api/api-cbt"

// interface ExamResult {
//   id_peserta: number
//   benar: number
//   salah: number
//   nilai: number
//   kkm: number
//   mulai: string
//   submit: string
//   jenis_ujian: string
//   nama_bank: string
//   histori_ujian: number
// }

// interface ApiResponse {
//   total: number
//   page: number
//   limit: number
//   data: ExamResult[]
// }

// type Locale = "id" | "en"

// const pageMeta: Record<Locale, { name: string; url: string }> = {
//   id: {
//     name: "Ujian",
//     url: "/ujian",
//   },
//   en: {
//     name: "Exam",
//     url: "/exam",
//   },
// }

// export default function ExamResultsPage() {
//   const [results, setResults] = useState<ApiResponse | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [page, setPage] = useState(1)
//   const [limit, setLimit] = useState(10)

//   const { locale } = useContext(LanguageContext)
//   const pagedata = pageMeta[(locale as Locale) || "id"]

//   const fetchData = useCallback(async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const response = await getHasilUjian(page, limit)
//       setResults(response)
//     } catch (err) {
//       setError("Gagal memuat data. Silakan coba lagi.")
//       console.error("Error fetching exam results:", err)
//     } finally {
//       setLoading(false)
//     }
//   }, [page, limit])

//   useEffect(() => {
//     fetchData()
//   }, [fetchData])

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return new Intl.DateTimeFormat("id-ID", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     }).format(date)
//   }

//   const totalPages = results ? Math.ceil(results.total / limit) : 1

//   return (
//     <Layout data={[pagedata]}>
//       <div className="container mx-auto py-8 px-4">
//         <Card className="w-full">
//           <CardHeader>
//             <CardTitle className="text-2xl">Hasil Ujian Siswa</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-col space-y-6">
//               {loading ? (
//                 <div className="flex justify-center items-center py-12">
//                   <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                   <span className="ml-2">Memuat data...</span>
//                 </div>
//               ) : error ? (
//                 <div className="text-center text-red-500 py-8">{error}</div>
//               ) : (
//                 <>
//                   <div className="rounded-md border">
//                     <Table>
//                       <TableHeader>
//                         <TableRow>
//                           <TableHead>ID Peserta</TableHead>
//                           <TableHead>Jenis Ujian</TableHead>
//                           <TableHead>Nama Bank</TableHead>
//                           <TableHead className="text-center">Benar</TableHead>
//                           <TableHead className="text-center">Salah</TableHead>
//                           <TableHead className="text-center">Nilai</TableHead>
//                           <TableHead className="text-center">KKM</TableHead>
//                           <TableHead className="text-center">Status</TableHead>
//                           <TableHead>Waktu Mulai</TableHead>
//                           <TableHead>Waktu Selesai</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {results?.data.map((result) => (
//                           <TableRow key={result.id_peserta}>
//                             <TableCell className="font-medium">{result.id_peserta}</TableCell>
//                             <TableCell>{result.jenis_ujian}</TableCell>
//                             <TableCell>{result.nama_bank}</TableCell>
//                             <TableCell className="text-center">{result.benar}</TableCell>
//                             <TableCell className="text-center">{result.salah}</TableCell>
//                             <TableCell className="text-center font-medium">{result.nilai}</TableCell>
//                             <TableCell className="text-center">{result.kkm}</TableCell>
//                             <TableCell className="text-center">
//                               <span
//                                 className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                   result.nilai >= result.kkm
//                                     ? "bg-green-100 text-green-800"
//                                     : "bg-red-100 text-red-800"
//                                 }`}
//                               >
//                                 {result.nilai >= result.kkm ? "Lulus" : "Tidak Lulus"}
//                               </span>
//                             </TableCell>
//                             <TableCell>{formatDate(result.mulai)}</TableCell>
//                             <TableCell>{formatDate(result.submit)}</TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>

//                   <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//                     <div className="flex items-center gap-2">
//                       <p className="text-sm text-muted-foreground">
//                         Halaman {page} dari {totalPages}
//                       </p>
//                       <div className="flex items-center gap-2">
//                         <p className="text-sm text-muted-foreground">Tampilkan:</p>
//                         <Select
//                           value={limit.toString()}
//                           onValueChange={(value) => {
//                             setLimit(Number(value))
//                             setPage(1)
//                           }}
//                         >
//                           <SelectTrigger className="w-[70px]">
//                             <SelectValue placeholder="10" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             <SelectItem value="5">5</SelectItem>
//                             <SelectItem value="10">10</SelectItem>
//                             <SelectItem value="20">20</SelectItem>
//                             <SelectItem value="50">50</SelectItem>
//                           </SelectContent>
//                         </Select>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setPage((p) => Math.max(1, p - 1))}
//                         disabled={page <= 1}
//                       >
//                         <ChevronLeft className="h-4 w-4" />
//                         <span className="sr-only">Halaman sebelumnya</span>
//                       </Button>
//                       <div className="flex items-center gap-1">
//                         <span className="text-sm font-medium">Halaman</span>
//                         <span className="text-sm font-medium">{page}</span>
//                         <span className="text-sm text-muted-foreground">dari {totalPages}</span>
//                       </div>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//                         disabled={page >= totalPages}
//                       >
//                         <ChevronRight className="h-4 w-4" />
//                         <span className="sr-only">Halaman berikutnya</span>
//                       </Button>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </Layout>
//   )
// }
import { useState, useEffect, useContext, useCallback } from "react"
import { ChevronLeft, ChevronRight, Eye, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

import Layout from "@/components/sidebar/Layout"
import LanguageContext from "@/context/LanguageContext"
import { getHasilUjian } from "@/app/api/api-cbt"

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
  id: {
    name: "Ujian",
    url: "/ujian",
  },
  en: {
    name: "Exam",
    url: "/exam",
  },
}

export default function ExamResultsPage() {
  const [results, setResults] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [error, setError] = useState<string | null>(null)
  const [selectedExam, setSelectedExam] = useState<ExamResult | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const { locale } = useContext(LanguageContext)
  const pagedata = pageMeta[(locale as Locale) ?? "id"]

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getHasilUjian(page, limit)
      setResults(response)
    } catch (err) {
      setError("Gagal memuat data. Silakan coba lagi.")
      console.error("Error fetching exam results:", err)
    } finally {
      setLoading(false)
    }
  }, [page, limit])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("id-ID", {
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

    return `${hours} jam ${minutes} menit ${seconds} detik`
  }

  const openDetail = (exam: ExamResult) => {
    setSelectedExam(exam)
    setIsDetailOpen(true)
  }

  const totalPages = results ? Math.ceil(results.total / limit) : 1

  return (
    <Layout data={[pagedata]}>
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold">Hasil Ujian Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Memuat data...</span>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 py-8">{error}</div>
              ) : (
                <>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead>Nama Ujian</TableHead>
                          <TableHead>Nilai</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Waktu</TableHead>
                          <TableHead className="text-center">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results?.data.map((result) => {
                          const isLulus = result.nilai >= result.kkm
                          return (
                            <TableRow key={result.id_peserta} className="hover:bg-muted/30">
                              <TableCell>
                                <div className="flex flex-col">
                                  <span>{result.jenis_ujian}</span>
                                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    {result.nama_bank}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-semibold">{result.nilai}</span>
                                  <span className="text-xs text-muted-foreground">
                                    Benar: {result.benar} | Salah: {result.salah}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={isLulus ? "bg-primary" : "bg-red-500"} >
                                  {isLulus ? "Lulus" : "Tidak Lulus"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col text-xs text-muted-foreground">
                                  <span>{formatDate(result.mulai)}</span>
                                  <span>Durasi: {calculateDuration(result.mulai, result.submit)}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Button variant="ghost" size="sm" onClick={() => openDetail(result)} className="h-8 p-3">
                                   <Eye className="h-4 w-4" /> Detail
                                  <span className="sr-only">Lihat Detail</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        Halaman {page} dari {totalPages}
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-muted-foreground">Tampilkan:</p>
                        <Select
                          value={limit.toString()}
                          onValueChange={(value) => {
                            setLimit(Number(value))
                            setPage(1)
                          }}
                        >
                          <SelectTrigger className="w-[70px] h-8">
                            <SelectValue placeholder="10" />
                          </SelectTrigger>
                          <SelectContent>
                            {[5, 10, 20, 50].map((num) => (
                              <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="h-8 w-8 p-0">
                        <ChevronLeft className="h-4 w-4" />
                        <span className="sr-only">Halaman sebelumnya</span>
                      </Button>
                      <span className="text-sm font-medium">{page}</span>
                      <span className="text-sm text-muted-foreground">/ {totalPages}</span>
                      <Button variant="outline" size="sm" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="h-8 w-8 p-0">
                        <ChevronRight className="h-4 w-4" />
                        <span className="sr-only">Halaman berikutnya</span>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dialog Detail */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Detail Hasil Ujian</DialogTitle>
            </DialogHeader>

            {selectedExam && (
              <Tabs defaultValue="detail" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="detail">Detail Ujian</TabsTrigger>
                  <TabsTrigger value="history">Riwayat Jawaban Ujian</TabsTrigger>
                </TabsList>

                <TabsContent value="detail" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Informasi umum */}
                    <div>
                      <p className="text-sm text-muted-foreground">ID Peserta</p>
                      <p className="text-lg font-semibold">{selectedExam.id_peserta}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Jenis Ujian</p>
                      <p className="text-lg font-semibold">{selectedExam.jenis_ujian}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Nama Bank Soal</p>
                      <p className="text-lg">{selectedExam.nama_bank}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Waktu Mulai</p>
                      <p>{formatDate(selectedExam.mulai)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Waktu Selesai</p>
                      <p>{formatDate(selectedExam.submit)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Durasi</p>
                      <p>{calculateDuration(selectedExam.mulai, selectedExam.submit)}</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t mt-6 grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <p className="text-sm text-muted-foreground">Nilai</p>
                      <p className="text-3xl font-bold">{selectedExam.nilai}</p>
                      <Badge variant={selectedExam.nilai >= selectedExam.kkm ? "default" : "destructive"}>
                        {selectedExam.nilai >= selectedExam.kkm ? "Lulus" : "Tidak Lulus"}
                      </Badge>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <p className="text-sm text-muted-foreground">Benar</p>
                      <p className="text-3xl font-bold text-green-600">{selectedExam.benar}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <p className="text-sm text-muted-foreground">Salah</p>
                      <p className="text-3xl font-bold text-red-600">{selectedExam.salah}</p>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Nilai KKM: <span className="font-medium">{selectedExam.kkm}</span>
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="pt-4">
                  <div className="text-center py-8 text-muted-foreground">
                    Tidak ada riwayat ujian sebelumnya
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}

