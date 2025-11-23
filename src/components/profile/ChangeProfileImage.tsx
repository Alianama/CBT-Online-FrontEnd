import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import {Upload} from "lucide-react";
import React, {useContext, useRef, useState} from "react";
import {toast} from "sonner";
import {putProfileImage} from "@/app/api/api-cbt.ts";
import {useGlobal} from "@/context/GlobalContext.tsx";
import LanguageContext from "@/context/LanguageContext.tsx";

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
    const {locale} = useContext(LanguageContext);
    const {setUserPicture} = useGlobal();

    const t = {
        id: {
            title: "Perbarui Foto Profil",
            description: "Klik tombol Pilih Gambar untuk memperbarui foto profil.",
            chooseImage: "Pilih Gambar",
            save: "Simpan Perubahan",
            saving: "Menyimpan...",
            cancel: "Batal",
            imageSuccess: "Klik Simpan Perubahan untuk melanjutkan!",
            uploadSuccess: "Foto profil berhasil diperbarui!",
            uploadFailed: "Gagal upload foto.",
            invalidFormat: "Format tidak didukung. Gunakan .jpeg, .jpg, atau .png.",
            sizeExceeded: "Ukuran file maksimal 3 MB.",
            note: "Format yang didukung: .jpeg, .jpg, .png — Ukuran maksimal: 3 MB",
        },
        en: {
            title: "Change Profile Picture",
            description: "Select new image button to update your profile picture.",
            chooseImage: "Choose Image",
            save: "Save",
            saving: "Saving...",
            cancel: "Cancel",
            imageSuccess: "Image selected successfully. Click 'Save' to upload.",
            uploadSuccess: "Profile picture updated successfully!",
            uploadFailed: "Failed to upload picture.",
            invalidFormat: "Unsupported format. Use .jpeg, .jpg, or .png.",
            sizeExceeded: "Maximum file size is 3 MB.",
            note: "Supported formats: .jpeg, .jpg, .png — Max size: 3 MB",
        }
    }[locale as "id" | "en"];

    const handleOpenFileDialog = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/jpg", "image/png"];
        const maxSizeInBytes = 3 * 1024 * 1024;

        if (!validTypes.includes(file.type)) {
            toast.error(t.invalidFormat);
            return;
        }

        if (file.size > maxSizeInBytes) {
            toast.error(t.sizeExceeded);
            return;
        }

        if (previewImage) {
            URL.revokeObjectURL(previewImage);
        }

        const imageUrl = URL.createObjectURL(file);
        setPreviewImage(imageUrl);
        setSelectedFile(file);
        toast.success(t.imageSuccess);
    };

    const handleSave = async () => {
        if (!selectedFile) return;
        setIsLoading(true);
        try {
            const response = await putProfileImage(selectedFile);
            toast.success(t.uploadSuccess);
            setUserPicture?.(response.picture);
            handleClose();
        } catch (error: any) {
            toast.error(error.message || t.uploadFailed);
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
                    <DialogTitle className="text-lg font-semibold">{t.title}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {t.description}
                    </DialogDescription>
                </DialogHeader>

                <img
                    src={previewImage || picture}
                    alt="Foto Profil"
                    className="w-2/3 h-2/3 rounded-3xl mx-auto object-cover border-4 border-indigo-500 shadow-lg my-4"
                />

                <p className="text-xs text-muted-foreground mb-2">{t.note}</p>

                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={handleOpenFileDialog}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                        <Upload size={20}/> {t.chooseImage}
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
                            {isLoading ? t.saving : t.save}
                        </button>
                        <button
                            onClick={handleClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition"
                        >
                            {t.cancel}
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
