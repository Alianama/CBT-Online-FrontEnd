"use client";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {File} from "lucide-react";
import {Viewer, Worker} from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

interface DocumentPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string;
    fileName?: string;
    fileType?: "pdf" | "doc" | "docx" | string;
    doc_Url?: string;
}

export function DocumentPreviewModal({
                                         doc_Url,
                                         isOpen,
                                         onClose,
                                         fileUrl,
                                         fileName,
                                         fileType,
                                     }: DocumentPreviewModalProps) {
    const determinedFileType = fileType || fileUrl.split(".").pop()?.toLowerCase();
    const isPdf = determinedFileType === "pdf";
    const isDoc = ["doc", "docx", "xlsx", "excel", "ppt", "pptx",].includes(determinedFileType || "");
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <File className="h-5 w-5"/>
                        <span>{fileName}</span>
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Preview file {fileName}
                </DialogDescription>
                <div className="flex-1 overflow-auto">
                    {isPdf ? (
                        <div className="flex flex-col items-center h-full">
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                                <div className="w-full h-full">
                                    <Viewer fileUrl={fileUrl}/>
                                </div>
                            </Worker>
                        </div>
                    ) : isDoc ? (
                        <iframe
                            src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fileUrl)}`}
                            className="w-full h-[80vh]"
                            frameBorder="0"
                        ></iframe>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p>
                                Unsupported file type.{" "}
                                <a
                                    href={doc_Url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline"
                                >
                                    Download instead
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
