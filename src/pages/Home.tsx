import Layout from "@/components/sidebar/Layout.tsx"
import {useContext} from "react";
import LangContext from "@/context/LangContext.tsx";
import {ArrowRight, CheckCircle2} from "lucide-react";
import {getAuthData} from "@/utils/storage.ts";
import {UserData} from "@/types/types.ts";

export default function Home() {
    const {locale} = useContext(LangContext);
    const pagedata = {
        id: {
            name: "Beranda",
            url: "/",
        },
        en: {
            name: "Home",
            url: "/",
        }
    }
    const authData = getAuthData();
    const userData: UserData | null = authData.userData ?? null;

    return (
        <Layout data={locale === "id" ? [pagedata.id] : [pagedata.en]}>
            <title>Home</title>
            <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
                <section className="container mx-auto px-4 pt-0 pb-12">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                            {`Selamat Datang, ${userData?.nama_siswa ?? "User Error"} !`}
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Kami senang Anda mengunjungi platform kami. Nikmati konten dan fitur yang tersedia.
                        </p>
                        <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    <section className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 inline-flex items-center">
                                Petunjuk Penggunaan
                                <div className="h-1 w-10 bg-primary ml-4 rounded-full"></div>
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                Ikuti langkah-langkah berikut untuk mengikuti ujian ini dengan optimal
                            </p>
                        </div>

                        <ul className="space-y-6">
                            {instructionSteps.map((step, index) => (
                              <InstructionStep key={index} number={index + 1} title={step.title} description={step.description} />
                            ))}
                        </ul>
                    </section>

                    <section className="space-y-6">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 inline-flex items-center">
                                Video Tutorial
                                <div className="h-1 w-10 bg-primary ml-4 rounded-full"></div>
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                Tonton video ini untuk memahami lebih lanjut tentang fitur-fitur website
                            </p>
                        </div>

                        <div className="aspect-video w-full overflow-hidden rounded-xl border shadow-lg bg-muted relative group">
                            <iframe
                              src="https://www.youtube.com/embed/OZLeEzWJR6s?si=_L7MZyA_2EYVU2_2"
                              title="YouTube video player"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="w-full h-full"
                            ></iframe>
                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                            <h3 className="font-medium mb-2 flex items-center">
                                <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                                Tentang Video Ini
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Video ini menjelaskan cara menggunakan fitur-fitur utama website kami. Anda dapat memutar video ini
                                langsung di halaman tanpa perlu mengunjungi YouTube.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </Layout>
    )
}

function InstructionStep({ number, title, description } : {number: number; title: string , description: string }) {
    return (
      <li className="relative pl-12 group">
          <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {number}
          </div>

          <div className="space-y-2">
              <h3 className="text-xl font-medium group-hover:text-primary transition-colors flex items-center">
                  {title}
                  <ArrowRight className="h-4 w-0 ml-2 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all" />
              </h3>
              <p className="text-muted-foreground">{description}</p>
          </div>
          {number < 5 && <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-border h-[calc(100%+1rem)]"></div>}
      </li>
    )
}

const instructionSteps = [
    {
        title: "Jadwal Ujian",
        description: "di TAB Jadwal Ujian, siswa yang sudah didaftarkan operator sebagai peserta ujian dapat melihat jadwal ujian di TAB Jadwal Ujian.",
    },
    {
        title: "Hasil Ujian",
        description: "di TAB Hasil Ujian, siswa dapat melihat langsung hasil ujian yang telah di selesaikan melalui TAB Jadwal Ujian.",
    },
    {
        title: "Mulai Ujian",
        description:"Tombol MULAI UJIAN hanya muncul selama durasi ujian berlangsung. Contoh ujian jam 07:00 dengan durasi 30 menit , maka tombol MULAI UJIAN muncul dari jam 07:00 sampai 07:30.\n",
    },
    {
        title: "Peraturan Ujian",
        description: "Siswa diharuskan login kurang lebih 15 menit sebelum ujian berlangsung. Pastikan memulai dan mengakhiri proses pengerjaan soal tepat waktu sebelum durasi ujian berakhir.\n",
    },
    {
        title: "Info",
        description: "Apabila terdapat masalah selama ujian, silahkan hubungi operator untuk mendapatkan informasi lebih lanjut.",
    },
]


