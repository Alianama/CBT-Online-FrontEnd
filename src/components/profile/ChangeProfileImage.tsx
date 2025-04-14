// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog.tsx";
// import {Upload} from "lucide-react";
// import React, {useRef, useState} from "react";
// import {toast} from "sonner";
//
// interface ChangeProfileImageProps {
//     picture?: string;
//     isChangeProfile: boolean;
//     setIsChangeProfile: (open: boolean) => void;
// }
//
// export default function ChangeProfileImage({
//                                                picture,
//                                                isChangeProfile,
//                                                setIsChangeProfile,
//                                            }: ChangeProfileImageProps) {
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
//     const handleUpdateClick = () => {
//         fileInputRef.current?.click();
//     };
//     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;
//         if (!file.type.startsWith("image/")) {
//             toast.error("File yang dipilih bukan gambar. Silakan pilih file gambar (jpg, png, dll).");
//             return;
//         }
//         const imageUrl = URL.createObjectURL(file);
//         setPreviewImage(imageUrl); // Update preview
//         toast.success("Gambar berhasil dipilih!");
//         console.log("File valid:", file);
//     };
//     return (
//         <Dialog open={isChangeProfile} onOpenChange={setIsChangeProfile}>
//             <DialogContent className="max-w-lg text-center">
//                 <DialogHeader>
//                     <DialogTitle className="text-lg font-semibold">Profile</DialogTitle>
//                     <DialogDescription className="text-sm text-muted-foreground">
//                         Lihat dan kelola foto profil Anda
//                     </DialogDescription>
//                 </DialogHeader>
//
//                 <img
//                     src={previewImage || picture}
//                     alt="Foto Profil"
//                     className="w-2/3 h-2/3 rounded-3xl mx-auto object-cover border-4 border-indigo-500 shadow-lg my-2"
//                 />
//                 <div className="flex justify-center gap-4 mt-4">
//                     <button
//                         onClick={handleUpdateClick}
//                         className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
//                     >
//                         <Upload size={20}/> Upload
//                     </button>
//                 </div>
//
//                 <input
//                     type="file"
//                     accept="image/*"
//                     ref={fileInputRef}
//                     onChange={handleFileChange}
//                     className="hidden"
//                 />
//             </DialogContent>
//         </Dialog>
//     );
// }

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Upload, Save, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
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
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const {refreshUser} = useGlobal();

    const handleUpdateClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("File yang dipilih bukan gambar.");
            return;
        }

        const imageUrl = URL.createObjectURL(file);
        setPreviewImage(imageUrl);
        setSelectedFile(file);
        toast.success("Gambar dipilih. Klik 'Simpan' untuk menyimpan.");
    };

    const handleSave = async () => {
        if (!selectedFile) {
            toast.warning("Silakan pilih gambar terlebih dahulu.");
            return;
        }

        try {
            setIsUploading(true);
            await putProfileImage(selectedFile);
            await refreshUser();
            toast.success("Foto profil berhasil diupdate!");
            setIsChangeProfile(false);
        } catch (error: any) {
            toast.error(error.message || "Gagal upload foto.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreviewImage(undefined);
        setIsChangeProfile(false);
    };

    return (
      <Dialog open={isChangeProfile} onOpenChange={setIsChangeProfile}>
          <DialogContent className="max-w-lg text-center">
              <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">Ubah Foto Profil</DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                      Pilih dan simpan foto profil baru Anda.
                  </DialogDescription>
              </DialogHeader>

              <img
                src={previewImage || picture}
                alt="Foto Profil"
                className="w-2/3 h-2/3 rounded-3xl mx-auto object-cover border-4 border-indigo-500 shadow-lg my-2"
              />

              <div className="flex justify-center gap-3 mt-4">
                  <button
                    onClick={handleUpdateClick}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                  >
                      <Upload size={20}/> Pilih Gambar
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={isUploading || !selectedFile}
                    className={`flex items-center gap-2 px-4 py-2 text-sm text-white rounded transition ${
                      !selectedFile || isUploading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                      <Save size={20}/> {isUploading ? "Menyimpan..." : "Simpan"}
                  </button>

                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                      <X size={20}/> Batal
                  </button>
              </div>

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
