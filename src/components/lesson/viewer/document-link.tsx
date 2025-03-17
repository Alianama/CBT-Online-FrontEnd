"use client"
import {useState} from "react"
import {Button} from "@/components/ui/button"
import {FileText} from "lucide-react"
import {DocumentPreviewModal} from "./document-preview"

interface DocumentLinkProps {
    fileUrl: string
    fileName?: string
    fileType?: "pdf" | "doc" | "docx" | string
    buttonText?: string
}

export function DocumentLink({
                                 fileUrl,
                                 fileName = "Document",
                                 fileType,
                                 buttonText = "Preview Document",
                             }: DocumentLinkProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    return (
        <>
            <Button variant="outline" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                <FileText className="h-4 w-4"/>
                {buttonText}
            </Button>

            <DocumentPreviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                fileUrl={fileUrl}
                fileName={fileName}
                fileType={fileType}
            />
        </>
    )
}

