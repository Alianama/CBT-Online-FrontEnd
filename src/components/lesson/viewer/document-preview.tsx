"use client"
import {useState} from "react"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {File} from "lucide-react"
// You'll need to install react-pdf with: npm install @react-pdf/renderer
import {Document, Page, pdfjs} from "react-pdf"
// Set up the PDF.js worker
// This should be done once in your application
// Alternative approach using a local worker file
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js"
// This should be done once in your application
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
// Alternatively, you can use:
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

interface DocumentPreviewModalProps {
    isOpen: boolean
    onClose: () => void
    fileUrl: string
    fileName?: string
    fileType?: "pdf" | "doc" | "docx" | string
}

export function DocumentPreviewModal({
                                         isOpen,
                                         onClose,
                                         fileUrl,
                                         fileName = "Document",
                                         fileType,
                                     }: DocumentPreviewModalProps) {
    const [numPages, setNumPages] = useState<number | null>(null)
    const [pageNumber, setPageNumber] = useState<number>(1)
    // Determine file type if not provided
    const determinedFileType = fileType || fileUrl.split(".").pop()?.toLowerCase()
    const isPdf = determinedFileType === "pdf"
    const isDoc = ["doc", "docx"].includes(determinedFileType || "")

    function onDocumentLoadSuccess({numPages}: { numPages: number }) {
        setNumPages(numPages)
        setPageNumber(1)
    }

    function changePage(offset: number) {
        setPageNumber((prevPageNumber) => Math.min(Math.max(prevPageNumber + offset, 1), numPages || 1))
    }

    // Google Docs Viewer URL for DOC files
    // const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <File className="h-5 w-5"/>
                        <span>{fileName}</span>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex-1 overflow-auto min-h-[100vh]">
                    {isPdf ? (
                        <div className="flex flex-col items-center">
                            <Document
                                file={fileUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                className="w-full"
                                loading={<div className="text-center py-10">Loading PDF...</div>}
                                error={<div className="text-center py-10 text-red-500">Failed to load PDF file.</div>}
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    width={Math.min(window.innerWidth * 0.8, 800)}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                            </Document>
                            {numPages && (
                                <div className="flex items-center gap-4 mt-4">
                                    <button
                                        onClick={() => changePage(-1)}
                                        disabled={pageNumber <= 1}
                                        className="px-3 py-1 bg-muted rounded-md disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <p>
                                        Page {pageNumber} of {numPages}
                                    </p>
                                    <button
                                        onClick={() => changePage(1)}
                                        disabled={pageNumber >= (numPages || 1)}
                                        className="px-3 py-1 bg-muted rounded-md disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : isDoc ? (
                        // <iframe src={googleDocsViewerUrl} width="100%" height="600px" className="border-0"
                        //         title={fileName}/>
                        <iframe
                            src={`https://view.officeapps.live.com/op/embed.aspx?src=${fileUrl}`}
                            className="w-full h-screen py-20 fixed top-0 left-0"
                            frameBorder="0"
                        ></iframe>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p>
                                Unsupported file type.{" "}
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer"
                                   className="text-primary underline">
                                    Download instead
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

