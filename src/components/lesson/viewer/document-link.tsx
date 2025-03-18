"use client"
import {useContext, useState} from "react"
import {Button} from "@/components/ui/button"
import {FileText} from "lucide-react"
import {DocumentPreviewModal} from "./document-preview"
import LangContext from "@/context/LangContext.tsx";

interface DocumentLinkProps {
    fileUrl: string,
    fileName?: string,
    fileType?: "pdf" | "doc" | "docx" | string,
}

export function DocumentLink({
                                 fileUrl,
                                 fileName = "Document",
                                 fileType,
                             }: DocumentLinkProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const {locale} = useContext(LangContext)
    return (
        <>
            {(fileType === "pdf" || fileType === "doc" || fileType === "text") && (
                <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2"
                >
                    <FileText className="h-4 w-4"/>
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

