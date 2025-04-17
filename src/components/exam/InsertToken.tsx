// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter
// } from "@/components/ui/dialog";
// import {Input} from "@/components/ui/input";
// import {Button} from "@/components/ui/button";
// import {postTokenUjian} from "@/app/api/api-cbt";
// import {toast} from "sonner";
// import {useState} from "react";
// import clsx from "clsx";
//
// interface InsertTokenProps {
//     id_peserta?: number;
//     isInsertToken: boolean;
//     setIsInsertToken: (open: boolean) => void;
// }
//
// export default function InsertToken({
//                                         id_peserta,
//                                         isInsertToken,
//                                         setIsInsertToken,
//                                     }: InsertTokenProps) {
//     const [inputToken, setInputToken] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [hasError, setHasError] = useState(false);
//     const [errorMessage, setErrorMessage] = useState("");
//     const onSubmitToken = async () => {
//         if (!inputToken) {
//             setHasError(true);
//             setErrorMessage("Token tidak boleh kosong.");
//             return;
//         }
//         setLoading(true);
//         setHasError(false);
//         setErrorMessage("");
//         try {
//             const response = await postTokenUjian(inputToken, id_peserta);
//             toast.success("Token berhasil diverifikasi!");
//             console.log("Berhasil:", response);
//             setIsInsertToken(false);
//         } catch (error) {
//             const message =
//                 error instanceof Error
//                     ? error.message
//                     : "Terjadi kesalahan yang tidak diketahui.";
//             toast.error(message);
//             setHasError(true);
//             setErrorMessage(message);
//         } finally {
//             setLoading(false);
//         }
//     };
//     return (
//         <Dialog open={isInsertToken} onOpenChange={setIsInsertToken}>
//             <DialogContent className="sm:max-w-md">
//                 <DialogHeader>
//                     <DialogTitle>Masukkan Token Ujian</DialogTitle>
//                 </DialogHeader>
//
//                 <div className="grid gap-2 py-4">
//                     <Input
//                         value={inputToken}
//                         onChange={(e) => setInputToken(e.target.value)}
//                         placeholder="Masukkan token ujian"
//                         disabled={loading}
//                         className={clsx(
//                             hasError && "border-red-500 animate-shake"
//                         )}
//                     />
//                     {hasError && (
//                         <p className="text-sm text-red-500">{errorMessage}</p>
//                     )}
//                 </div>
//
//                 <DialogFooter>
//                     <Button variant="outline" onClick={() => setIsInsertToken(false)} disabled={loading}>
//                         Batal
//                     </Button>
//                     <Button onClick={onSubmitToken} disabled={loading}>
//                         {loading ? "Memverifikasi..." : "Submit"}
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }
"use client"
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {postTokenUjian} from "@/app/api/api-cbt"
import {toast} from "sonner"
import {useState} from "react"
import {CheckCircle2, KeyRound, Loader2, ShieldAlert} from "lucide-react"
import {cn} from "@/lib/utils"
import {useNavigate} from "react-router-dom"

interface InsertTokenProps {
    id_peserta?: number
    isInsertToken: boolean
    setIsInsertToken: (open: boolean) => void
}

export default function InsertToken({id_peserta, isInsertToken, setIsInsertToken}: InsertTokenProps) {
    const navigate = useNavigate();
    const [inputToken, setInputToken] = useState("")
    const [loading, setLoading] = useState(false)
    const [hasError, setHasError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [successData, setSuccessData] = useState<any>(null)
    const onSubmitToken = async () => {
        if (!inputToken) {
            setHasError(true)
            setErrorMessage("Token tidak boleh kosong.")
            return
        }
        setLoading(true)
        setHasError(false)
        setErrorMessage("")
        setSuccessData(null)
        try {
            const response = await postTokenUjian(inputToken, id_peserta)
            console.log(response)
            const websocket = response.websocket;
            if (response.status === "success") {
                setSuccessData(response.data)
                toast.success(response.status)
                navigate(`/exam/${websocket.token}`)
                setTimeout(() => {
                    setIsInsertToken(false)
                    setSuccessData(null)
                    setInputToken("")
                }, 3000)
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui."
            toast.error(message)
            setHasError(true)
            setErrorMessage(message)
        } finally {
            setLoading(false)
        }
    }
    // Format minutes to hours and minutes
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const mins = minutes % 60
        if (hours > 0) {
            return `${hours} jam ${mins > 0 ? `${mins} menit` : ""}`
        }
        return `${mins} menit`
    }
    return (
        <Dialog open={isInsertToken} onOpenChange={setIsInsertToken}>
            <DialogContent className="sm:max-w-md overflow-hidden border-0 shadow-lg">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary to-cyan-800"/>
                {successData ? (
                    <div className="flex flex-col items-center pt-2">
                        <div
                            className="flex items-center justify-center w-16 h-16 mb-2 rounded-full bg-green-50 dark:bg-green-900/20">
                            <CheckCircle2 className="w-8 h-8 text-primary dark:text-Primary"/>
                        </div>

                        <DialogHeader className="text-center">
                            <DialogTitle className="text-xl font-bold text-green-600 dark:text-green-400">
                                Token Berhasil Diverifikasi
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Anda akan diarahkan ke halaman ujian dalam beberapa detik
                            </p>
                        </DialogHeader>

                        <div
                            className="w-full mt-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800">
                            <h3 className="font-bold text-lg mb-2">{successData.nama_ujian}</h3>

                            <div className="grid gap-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">ID Ujian:</span>
                                    <span className="font-medium">{successData.id_ujian}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Durasi:</span>
                                    <span className="font-medium">{formatDuration(successData.durasi)}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Jumlah Soal:</span>
                                    <span className="font-medium">{successData.jumlah_soal} soal</span>
                                </div>
                            </div>
                        </div>

                        <div className="w-full mt-4 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 animate-spin mr-2 text-blue-600"/>
                            <span className="text-sm">Mempersiapkan ujian...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col items-center pt-6">
                            <div
                                className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-blue-50 dark:bg-blue-900/20">
                                <KeyRound className="w-8 h-8 text-blue-600 dark:text-blue-400"/>
                            </div>

                            <DialogHeader className="text-center">
                                <DialogTitle className="text-xl font-bold">Masukkan Token Ujian</DialogTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Silakan masukkan token yang telah diberikan untuk memulai ujian
                                </p>
                            </DialogHeader>
                        </div>

                        <div className="grid gap-4 py-4">
                            <div className="relative">
                                <Input
                                    value={inputToken}
                                    onChange={(e) => setInputToken(e.target.value)}
                                    placeholder="Masukkan token ujian"
                                    disabled={loading}
                                    className={cn(
                                        "pl-10 py-6 text-lg transition-all border-2 focus-visible:ring-primary",
                                        hasError
                                            ? "border-red-500 animate-shake focus-visible:ring-red-500"
                                            : "border-input focus-visible:border-primary",
                                    )}
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <ShieldAlert className="w-5 h-5"/>
                                </div>
                            </div>

                            {hasError && (
                                <div
                                    className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded-md animate-fadeIn">
                                    <ShieldAlert className="w-4 h-4 shrink-0"/>
                                    <p className="text-sm">{errorMessage}</p>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="flex flex-col sm:flex-row gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsInsertToken(false);
                                    setInputToken("");
                                    setHasError(false)
                                    setErrorMessage("")
                                }}
                                disabled={loading}
                                className="w-full sm:w-auto"
                            >
                                Batal
                            </Button>

                            <Button
                                onClick={onSubmitToken}
                                disabled={loading}
                                className="w-full sm:w-auto bg-gradient-to-r from-primary to-blue-700 hover:from-blue-700 hover:to-blue-800"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin"/>
                    Memverifikasi...
                  </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4"/>
                    Submit
                  </span>
                                )}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
