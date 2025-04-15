import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import {Upload} from "lucide-react";
import React, {useRef, useState} from "react";
import {toast} from "sonner";
import {putProfileImage} from "@/app/api/api-cbt.ts";
import {useGlobal} from "@/context/GlobalContext.tsx";

interface ChangeProfileImageProps {
    picture?: string;
    isChangeProfile: boolean;
    setIsChangeProfile: (open: boolean) => void;
}

export default function ChangeProfileImage({
                                               picture,
                                               isChangeProfile,
                                               setIsChangeProfile,
                                           }: ChangeProfileImageProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const {setUserPicture} = useGlobal();
    const handleOpenFileDialog = () => {
        fileInputRef.current?.click();
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const validTypes = ["image/jpeg", "image/jpg", "image/png"];
        const maxSizeInBytes = 3 * 1024 * 1024;
        if (!validTypes.includes(file.type)) {
            toast.error("Format tidak didukung. Gunakan .jpeg, .jpg, atau .png.");
            return;
        }
        if (file.size > maxSizeInBytes) {
            toast.error("Ukuran file maksimal 3MB.");
            return;
        }
        // Revoke URL lama jika ada
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }
        const imageUrl = URL.createObjectURL(file);
        setPreviewImage(imageUrl);
        setSelectedFile(file);
        toast.success("Gambar berhasil dipilih. Klik 'Simpan' untuk mengunggah.");
    };
    const handleSave = async () => {
        if (!selectedFile) return;
        setIsLoading(true);
        try {
            const response = await putProfileImage(selectedFile);
            toast.success("Foto profil berhasil diperbarui!");
            setUserPicture?.(response.picture);
            handleClose();
        } catch (error: any) {
            toast.error(error.message || "Gagal upload foto.");
        } finally {
            setIsLoading(false);
        }
    };
    const handleClose = () => {
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }
        setPreviewImage(undefined);
        setSelectedFile(null);
        setIsChangeProfile(false);
    };
    return (
        <Dialog open={isChangeProfile} onOpenChange={setIsChangeProfile}>
            <DialogContent className="max-w-lg text-center">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Ubah Foto Profil</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Pilih gambar baru dan simpan untuk memperbarui foto profil.
                    </DialogDescription>
                </DialogHeader>

                <img
                    src={previewImage || picture}
                    alt="Foto Profil"
                    className="w-2/3 h-2/3 rounded-3xl mx-auto object-cover border-4 border-indigo-500 shadow-lg my-4"
                />

                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={handleOpenFileDialog}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                        <Upload size={20}/> Pilih Gambar
                    </button>
                </div>

                {selectedFile && (
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className={`px-4 py-2 text-sm text-white rounded transition ${
                                isLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {isLoading ? "Menyimpan..." : "Simpan"}
                        </button>
                        <button
                            onClick={handleClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition"
                        >
                            Batal
                        </button>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </DialogContent>
        </Dialog>
    );
}
