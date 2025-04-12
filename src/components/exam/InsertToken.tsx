import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {postTokenUjian} from "@/app/api/api-cbt";
import {toast} from "sonner";
import {useState} from "react";
import clsx from "clsx";

interface InsertTokenProps {
    id_peserta?: number;
    isInsertToken: boolean;
    setIsInsertToken: (open: boolean) => void;
}

export default function InsertToken({
                                        id_peserta,
                                        isInsertToken,
                                        setIsInsertToken,
                                    }: InsertTokenProps) {
    const [inputToken, setInputToken] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const onSubmitToken = async () => {
        if (!inputToken) {
            setHasError(true);
            setErrorMessage("Token tidak boleh kosong.");
            return;
        }
        setLoading(true);
        setHasError(false);
        setErrorMessage("");
        try {
            const response = await postTokenUjian(inputToken, id_peserta);
            toast.success("Token berhasil diverifikasi!");
            console.log("Berhasil:", response);
            setIsInsertToken(false);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Terjadi kesalahan yang tidak diketahui.";
            toast.error(message);
            setHasError(true);
            setErrorMessage(message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Dialog open={isInsertToken} onOpenChange={setIsInsertToken}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Masukkan Token Ujian</DialogTitle>
                </DialogHeader>

                <div className="grid gap-2 py-4">
                    <Input
                        value={inputToken}
                        onChange={(e) => setInputToken(e.target.value)}
                        placeholder="Masukkan token ujian"
                        disabled={loading}
                        className={clsx(
                            hasError && "border-red-500 animate-shake"
                        )}
                    />
                    {hasError && (
                        <p className="text-sm text-red-500">{errorMessage}</p>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsInsertToken(false)} disabled={loading}>
                        Batal
                    </Button>
                    <Button onClick={onSubmitToken} disabled={loading}>
                        {loading ? "Memverifikasi..." : "Submit"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
