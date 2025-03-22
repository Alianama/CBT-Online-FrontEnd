"use client";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileType,
} from "lucide-react";
import {materiCard} from "@/types/types.ts";
import {Link} from "react-router-dom";
import {Badge} from "@/components/ui/badge.tsx";
import {
  Dialog, DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger
} from "@/components/ui/dialog";

const VITE_ASSET_DOMAIN = import.meta.env.VITE_ASSET_DOMAIN;
export default function MateriCard({
                                     materi,
                                     subject,
                                     idKelas,
                                     idMapel,
                                   }: materiCard) {
  const atachment_URL = materi.attachment?.replace(
    /\{\{DOMAIN}}/g,
    VITE_ASSET_DOMAIN,
  );

  return (
    <Card className="w-full max-w-[300px] shadow-sm min-h-[200px] flex flex-col">
      <CardContent className="p-3 flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-start gap-2">
            <FileSpreadsheet className="w-5 h-5 text-muted-foreground mt-0.5"/>
            <div>
              <h3 className="text-sm font-medium">{materi.title}</h3>
              {(materi.size || materi.time_created) && (
                <div className="flex flex-col space-y-0.5 mt-0.5">
                  {materi.size && (
                    <p className="text-xs text-muted-foreground">
                      Size: {materi.size}
                    </p>
                  )}
                  {materi.time_created && (
                    <p className="text-xs text-muted-foreground">
                      {materi.time_created}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          <Badge
            className="bg-blue-50 text-blue-700 cursor-pointer border-blue-200 hover:bg-emerald-100 transition-colors duration-300 px-2 py-1">
            <FileType className="h-3.5 w-3.5 mr-1"/> {materi.tipe_materi}
          </Badge>
        </div>

        <p className="text-sm">
          Materi berupa file <strong>{materi.tipe_materi}</strong> yang bisa kamu{" "}
          {materi.tipe_materi === "text" ? "lihat" : "download"}.
        </p>


      </CardContent>
      <CardFooter className="flex flex-col gap-1.5 p-3 pt-0 mt-auto">
        <div className="grid grid-cols-2 gap-1.5 w-full">
          {
            materi.tipe_materi !== "text" && (
              <Link
                to={
                  materi.tipe_materi === "zip"
                    ? "#"
                    : `/lesson/${subject}/${idKelas}/${idMapel}/materi/${materi.tipe_materi}/${encodeURIComponent(atachment_URL)}/${materi.title}`
                }
                onClick={(e) => {
                  if (
                    materi.tipe_materi === "zip"
                  ) {
                    e.preventDefault();
                  }
                }}
              >
                <Button
                  className="w-full text-xs h-8 px-2 bg-primary"
                  size="sm"
                  disabled={
                    materi.tipe_materi === "zip"
                  }
                >
                  <ExternalLink/> Open
                </Button>
              </Link>
            )}
          {materi.tipe_materi === "text" && (

            <Dialog>
              <DialogTrigger>
                <Button className="w-full text-xs h-8 px-2 bg-primary"><ExternalLink/> Open</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  {materi.title}
                </DialogHeader>
                <DialogDescription>
                  <p
                    className="text-xs leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: (materi.content) || "No content available.",

                    }}
                  ></p>
                </DialogDescription>
                <DialogFooter>
                  <DialogClose>
                    <Button>Close</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          )


          }
          <Button
            onClick={() => {
              const link = document.createElement("a");
              link.href = atachment_URL;
              link.target = "_blank";
              link.download = "";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            size="sm"
            className="w-full text-xs h-8 px-2"
            disabled={
              materi.tipe_materi === "text"
            }
          >
            <Download className="h-4 w-4 mr-2"/>
            Download
          </Button>
        </div>
        <p className=" text-xs text-neutral-900/50">*Klik Tombol Open untuk membuka file</p>
      </CardFooter>
    </Card>
  );
}
