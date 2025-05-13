import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileType,
} from "lucide-react";
import { Materi } from "@/types/types"; // Perbaikan: gunakan tipe Materi
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const VITE_ASSET_DOMAIN = import.meta.env.VITE_ASSET_DOMAIN || "";

// Props yang harus dikirim dari SubjectPage
interface MateriCardProps {
  index: string;
  materi: Materi;
  subject?: string;
  idKelas?: string;
  idMapel?: string;
  content?: string
}

export default function MateriCard({ index,
                                     materi,
                                     subject,
                                     idKelas,
                                     idMapel,
                                   }: MateriCardProps) {
  const attachment_URL = materi.attachment?.replace(/\{\{DOMAIN}}/g, VITE_ASSET_DOMAIN);

  return (
    <Card className="w-full max-w-[300px] shadow-sm min-h-[200px] flex flex-col">
      <CardContent className="p-3 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-start gap-2">
            <FileSpreadsheet className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="text-sm font-medium">{materi.title}</h3>
              {(materi.size || materi.time_created) && (
                <div className="flex flex-col space-y-0.5 mt-0.5">
                  {materi.size && (
                    <span className="text-xs text-muted-foreground">
                      Size: {materi.size}
                    </span>
                  )}
                  {materi.time_created && (
                    <span className="text-xs text-muted-foreground">
                      {materi.time_created}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          <Badge className="bg-blue-50 text-blue-700 cursor-pointer border-blue-200 hover:bg-emerald-100 transition-colors duration-300 px-2 py-1">
            <FileType className="h-3.5 w-3.5 mr-1" /> {materi.tipe_materi}
          </Badge>
        </div>

        <span className="text-sm">
          Materi berupa file <strong>{materi.tipe_materi}</strong> yang bisa kamu{" "}
          {materi.tipe_materi === "text" ? "lihat" : "download"}.
        </span>
      </CardContent>

      <CardFooter className="flex flex-col gap-1.5 p-3 pt-0 mt-auto">
        <div className="grid grid-cols-2 gap-1.5 w-full">
          {materi.tipe_materi !== "text" ? (
            <Link
              to={
                materi.tipe_materi === "zip" || !attachment_URL
                  ? "#"
                  : `/lesson/${index}/${subject}/${idKelas}/${idMapel}/materi/${materi.tipe_materi}/${encodeURIComponent(attachment_URL)}/${encodeURIComponent(materi.title)}`
              }
              onClick={(e) => {
                if (materi.tipe_materi === "zip" || !attachment_URL) {
                  e.preventDefault();
                }
              }}
            >
              <Button
                className="w-full text-xs h-8 px-2 bg-primary"
                size="sm"
                disabled={materi.tipe_materi === "zip" || !attachment_URL}
              >
                <ExternalLink className="h-4 w-4 mr-1" /> Open
              </Button>
            </Link>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full text-xs h-8 px-2 bg-primary">
                  <ExternalLink className="h-4 w-4 mr-1" /> Open
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <VisuallyHidden>
                    <DialogTitle>{materi.title}</DialogTitle>
                  </VisuallyHidden>
                </DialogHeader>
                <DialogDescription>
                  <span
                    className="text-xs leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: materi.content || "No content available.",
                    }}
                  ></span>
                </DialogDescription>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button>Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <Button
            onClick={() => {
              if (!attachment_URL) return;
              const link = document.createElement("a");
              link.href = attachment_URL;
              link.target = "_blank";
              link.download = "";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            size="sm"
            className="w-full text-xs h-8 px-2"
            disabled={materi.tipe_materi === "text" || !attachment_URL}
          >
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
        <span className="text-xs text-neutral-900/50">
          *Klik Tombol Open untuk membuka file
        </span>
      </CardFooter>
    </Card>
  );
}
