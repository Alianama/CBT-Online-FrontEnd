import Layout from "@/components/sidebar/Layout.tsx";
import { useContext, useEffect, useState } from "react";
import LanguageContext from "@/context/LanguageContext.tsx";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getAuthData } from "@/utils/storage.ts";
import { UserData } from "@/types/types.ts";
import { useTranslation } from "@/hooks/useTranslation";

export default function Home() {
  const [userData, setUserData] = useState<UserData>();
  const { locale } = useContext(LanguageContext);
  const t = useTranslation();
  const safeLocale = locale === "id" || locale === "en" ? locale : "en";
  useEffect(() => {
    (async () => {
      const authData = getAuthData();
      setUserData(authData?.userData ?? undefined);
    })();
  }, []);
  const pageData: Record<"id" | "en", { name: string; url: string }> = {
    id: { name: "Beranda", url: "/" },
    en: { name: "Home", url: "/" },
  };

  return (
    <Layout data={[pageData[safeLocale]]}>
      <title>{pageData[safeLocale].name}</title>
      <main className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <section className="container mx-auto px-4 pt-0 pb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold tracking-tight my-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {`${t.home.welcome} ${userData?.nama}`}
            </h1>
            <p className="text-xm text-muted-foreground ">
              {t.home.examMessage}
            </p>
            <p className="text-xm text-muted-foreground mb-8">
              {t.home.examMessage2}
            </p>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <section className="space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-6 inline-flex items-center">
                {t.home.instructions}
                <div className="h-1 w-10 bg-primary ml-4 rounded-full"></div>
              </h2>
              <p className="text-muted-foreground mb-8">
                {t.home.instructionsDesc}
              </p>
            </div>

            <ul className="space-y-6">
              {instructionSteps[safeLocale].map((step, index) => (
                <InstructionStep
                  key={index}
                  number={index + 1}
                  title={step.title}
                  description={step.description}
                />
              ))}
            </ul>
          </section>

          <section className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-6 inline-flex items-center">
                {t.home.videoTutorial}
                <div className="h-1 w-10 bg-primary ml-4 rounded-full"></div>
              </h2>
              <p className="text-muted-foreground mb-8">{t.home.videoDesc}</p>
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
                {t.home.aboutVideo}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.home.aboutVideoDesc}
              </p>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}

function InstructionStep({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
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
      {number < 5 && (
        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-border h-[calc(100%+1rem)]"></div>
      )}
    </li>
  );
}

const instructionSteps: Record<
  "id" | "en",
  { title: string; description: string }[]
> = {
  id: [
    {
      title: "Jadwal Ujian",
      description: "Siswa dapat melihat jadwal ujian di TAB Jadwal Ujian.",
    },
    {
      title: "Hasil Ujian",
      description: "Siswa dapat melihat hasil ujian yang telah selesai.",
    },
    {
      title: "Mulai Ujian",
      description:
        "Tombol MULAI UJIAN hanya muncul selama durasi ujian berlangsung.",
    },
    {
      title: "Peraturan Ujian",
      description:
        "Siswa harus login sebelum ujian dimulai dan menyelesaikan tepat waktu.",
    },
    {
      title: "Info",
      description: "Hubungi operator jika ada masalah selama ujian.",
    },
  ],
  en: [
    {
      title: "Exam Schedule",
      description:
        "Students can check the exam schedule in the Exam Schedule tab.",
    },
    {
      title: "Exam Results",
      description: "Students can view their completed exam results.",
    },
    {
      title: "Start Exam",
      description:
        "The START EXAM button only appears during the exam duration.",
    },
    {
      title: "Exam Rules",
      description:
        "Students must log in before the exam starts and finish on time.",
    },
    {
      title: "Info",
      description:
        "Contact the operator if you have any issues during the exam.",
    },
  ],
};
