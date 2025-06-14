import { Link, useParams } from "react-router-dom";
import Layout from "@/components/sidebar/Layout.tsx";
import { useContext, useEffect, useState } from "react";
import LanguageContext from "@/context/LanguageContext.tsx";
import { ArrowLeft } from "lucide-react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useMateriStore } from "@/stores/materiStore";

export default function DocumentOpen() {
  const materiList = useMateriStore((state) => state.materiList);
  const { tipe_materi, attachment, title, subject, idKelas, idMapel, index } =
    useParams<{
      index: any;
      tipe_materi?: string;
      attachment?: string;
      subject?: string;
      idKelas?: string;
      idMapel?: string;
      title?: string;
    }>();

  const parsedIndex = index ? parseInt(index, 10) : -1;
  const materi :any = materiList[parsedIndex];
  const { locale } = useContext(LanguageContext);
  const safeLocale = locale === "id" || locale === "en" ? locale : "en";

  const [file_url, setFileUrl] = useState("");

  const pageData: Record<"id" | "en", { name: string; url: string }[]> = {
    id: [
      { name: "Materi", url: "/lesson" },
      { name: "book", url: "#" },
    ],
    en: [
      { name: "Lesson", url: "/lesson" },
      { name: "Book", url: "#" },
    ],
  };

  useEffect(() => {
    if (attachment) {
      setFileUrl(decodeURIComponent(attachment));
    } else if (materi?.attachment) {
      setFileUrl(materi.attachment.replace(/\{\{DOMAIN}}/g, import.meta.env.VITE_ASSET_DOMAIN));
    }
  }, [attachment, materi]);

  const determinedFileType =
    tipe_materi?.toLowerCase() || file_url.split(".").pop()?.toLowerCase();

  const isPdf = determinedFileType === "pdf";
  const isDoc = ["doc", "docx", "xlsx", "excel", "ppt", "pptx"].includes(determinedFileType || "");

  return (
    <Layout data={pageData[safeLocale]}>
      <title>{`Materi - ${title}`}</title>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="mb-6">
          <Link
            to={`/lesson/${subject}/${idKelas}/${idMapel}`}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Kembali
          </Link>

          <div className="flex-1 overflow-auto">
            {materi?.content ? (
              <div
                className="text-sm p-10 max-md:p-5 max-md:text-xs leading-relaxed mb-4"
                dangerouslySetInnerHTML={{
                  __html: materi.content,
                }}
              ></div>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">Tidak ada konten.</p>
            )}

            {file_url ? (
              isPdf ? (
                <div className="flex flex-col items-center h-full">
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <div className="w-full h-full">
                      <Viewer fileUrl={file_url} />
                    </div>
                  </Worker>
                </div>
              ) : isDoc ? (
                <iframe
                  src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                    file_url,
                  )}`}
                  className="w-full h-[80vh]"
                  frameBorder="0"
                ></iframe>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>
                    Unsupported file type.{" "}
                    <a
                      href={file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      Download instead
                    </a>
                  </p>
                </div>
              )
            ) : (
              <p className="text-center text-sm text-muted-foreground">Loading file...</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
