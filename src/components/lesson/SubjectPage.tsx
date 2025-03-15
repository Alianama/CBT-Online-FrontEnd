"use client"

import { useParams, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, Clock, Download, FileText } from "lucide-react"

export default function SubjectPage() {
  const { subject } = useParams<{ subject: string }>()

  // In a real app, you would fetch this data from an API or database
  const subjectMap: Record<string, { title: string; description: string; color: string }> = {
    ipa: {
      title: "IPA",
      description: "Ilmu Pengetahuan Alam",
      color: "bg-blue-100",
    },
    ips: {
      title: "IPS",
      description: "Ilmu Pengetahuan Sosial",
      color: "bg-green-100",
    },
    matematika: {
      title: "Matematika",
      description: "Aljabar, Geometri, Statistik",
      color: "bg-purple-100",
    },
    // Add other subjects here
  }

  const currentSubject = subject
    ? subjectMap[subject] || {
    title: subject.charAt(0).toUpperCase() + subject.slice(1).replace("-", " "),
    description: "Materi Pembelajaran",
    color: "bg-gray-100",
  }
    : { title: "", description: "", color: "" }

  // Mock data for materials
  const materials = [
    {
      id: 1,
      title: "Pengenalan Dasar",
      description: "Materi dasar untuk pemula",
      type: "pdf",
      level: "dasar",
      duration: "30 menit",
      date: "2023-01-15",
    },
    {
      id: 2,
      title: "Konsep Lanjutan",
      description: "Materi untuk tingkat menengah",
      type: "video",
      level: "menengah",
      duration: "45 menit",
      date: "2023-02-20",
    },
    {
      id: 3,
      title: "Studi Kasus",
      description: "Analisis kasus nyata",
      type: "pdf",
      level: "lanjutan",
      duration: "60 menit",
      date: "2023-03-10",
    },
    {
      id: 4,
      title: "Praktikum",
      description: "Panduan praktik laboratorium",
      type: "document",
      level: "menengah",
      duration: "90 menit",
      date: "2023-04-05",
    },
    {
      id: 5,
      title: "Ujian Latihan",
      description: "Soal-soal latihan untuk persiapan ujian",
      type: "pdf",
      level: "lanjutan",
      duration: "120 menit",
      date: "2023-05-12",
    },
  ]

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Kembali
        </Link>

        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center ${currentSubject.color}`}
            >
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{currentSubject.title}</h1>
              <p className="text-muted-foreground">{currentSubject.description}</p>
            </div>
          </div>
          <Button className="w-full sm:w-auto">Tambah Materi Baru</Button>
        </div>
      </div>

      <Tabs defaultValue="semua" className="w-full">
        <div className="mb-6">
          <TabsList className="flex w-full flex-wrap justify-start gap-1 overflow-x-auto">
            <TabsTrigger value="semua">Semua</TabsTrigger>
            <TabsTrigger value="dasar">Dasar</TabsTrigger>
            <TabsTrigger value="menengah">Menengah</TabsTrigger>
            <TabsTrigger value="lanjutan">Lanjutan</TabsTrigger>
            <TabsTrigger value="ujian">Ujian</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="semua">
          <div className="grid gap-4">
            {materials.map((material) => (
              <MaterialCard key={material.id} material={material} subjectSlug={subject || ""} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dasar">
          <div className="grid gap-4">
            {materials
              .filter((material) => material.level === "dasar")
              .map((material) => (
                <MaterialCard key={material.id} material={material} subjectSlug={subject || ""} />
              ))}
          </div>
        </TabsContent>

        {/* Other tab contents similar to above */}
        {/* I'm abbreviating for space, but you would include all the other tabs */}
      </Tabs>
    </div>
  )
}

interface Material {
  id: number
  title: string
  description: string
  type: string
  level: string
  duration: string
  date: string
}

interface MaterialCardProps {
  material: Material
  subjectSlug: string
}

function MaterialCard({ material, subjectSlug }: MaterialCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5" />
      case "video":
        return <BookOpen className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "dasar":
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Dasar</span>
      case "menengah":
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Menengah</span>
      case "lanjutan":
        return <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Lanjutan</span>
      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2 px-3 pt-3 sm:px-6 sm:pt-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div>
            <CardTitle className="text-lg sm:text-xl">{material.title}</CardTitle>
            <CardDescription>{material.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">{getLevelBadge(material.level)}</div>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 sm:px-6 sm:pb-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{material.duration}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              {getTypeIcon(material.type)}
              <span className="uppercase">{material.type}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
              <Link to={`/subjects/${subjectSlug}/${material.id}`} className="w-full flex justify-center">
                Lihat
              </Link>
            </Button>
            <Button size="sm" className="flex-1 sm:flex-none">
              <Download className="h-4 w-4 mr-2" />
              Unduh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

