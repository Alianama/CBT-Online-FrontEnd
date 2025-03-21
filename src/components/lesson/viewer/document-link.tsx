"use client";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { DocumentPreviewModal } from "./document-preview";
import LanguageContext from "@/context/LanguageContext.tsx";

interface DocumentLinkProps {
  fileUrl: string;
  fileName?: string;
  fileType?: "pdf" | "doc" | "docx" | string;
}

export function DocumentLink({
  fileUrl,
  fileName = "Document",
  fileType,
}: DocumentLinkProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { locale } = useContext(LanguageContext);
  return (
    <>
      {(fileType === "pdf" ||
        fileType === "doc" ||
        fileType === "text" ||
        fileType === "excel" ||
        fileType === "xlsx" ||
        fileType === "ppt") && (
        <Button
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Zap className="h-4 w-4" />
          {locale === "id" ? "Lihat Cepat" : "Quick Wiew"}
        </Button>
      )}

      <DocumentPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fileUrl={fileUrl}
        fileName={fileName}
        fileType={fileType}
      />
    </>
  );
}
