import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {useContext, useState} from "react";
import {Eye, EyeOff, Key} from "lucide-react";
import {Input} from "@/components/ui/input";
import {updatePassword} from "@/app/api/api-cbt.ts";
import {toast} from "sonner";
import LanguageContext from "@/context/LanguageContext.tsx";
import {useNavigate} from "react-router-dom";

export default function ChangePassword() {
    const {locale} = useContext(LanguageContext);
    const translations = {
        id: {
            changePassword: "Ganti Password",
            confirmation: "Konfirmasi",
            confirmChange: "Apakah Anda yakin ingin mengganti password?",
            yes: "Ya",
            no: "Tidak",
            newPassword: "Masukkan password baru",
            confirmNewPassword: "Konfirmasi password baru",
            updatePassword: "Ubah Password",
            enterNewPassword: "Masukkan password baru untuk memperbarui akun Anda.",
            savePassword: "Simpan Password",
            passwordMismatch: "Password tidak cocok",
            passwordUpdated: "Password berhasil diperbarui",
            errorOccurred: "Terjadi kesalahan",
            successChnagePassword: "Ubah Password Berhasil",
            successChnagePassword2: "Silahkan login kembali dengan password baru!",
        },
        en: {
            changePassword: "Change Password",
            confirmation: "Confirmation",
            confirmChange: "Are you sure you want to change your password?",
            yes: "Yes",
            no: "No",
            newPassword: "Enter new password",
            confirmNewPassword: "Confirm new password",
            updatePassword: "Update Password",
            enterNewPassword: "Enter a new password to update your account.",
            savePassword: "Save Password",
            passwordMismatch: "Passwords do not match",
            passwordUpdated: "Password updated successfully",
            errorOccurred: "An error occurred",
            successChnagePassword: "Change Password successfully",
            successChnagePassword2: "Please re login with new password!",
        },
    };
    const t = translations[locale as keyof typeof translations];
    const [isThridDialogOpen, setIsThridDialogOpen] = useState(false);
    const [isFirstDialogOpen, setFirstDialogOpen] = useState(false);
    const [isSecondDialogOpen, setSecondDialogOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const resetState = () => {
        setPassword("");
        setConfirmPassword("");
        setErrorMessage(null);
        setShowPassword(false);
        setShowConfirmPassword(false);
        setLoading(false);
    };
    const handleConfirmPassword = async () => {
        setLoading(true);
        if (password !== confirmPassword) {
            setErrorMessage(t.passwordMismatch);
            toast.error(t.passwordMismatch);
            setLoading(false);
            return;
        }
        try {
            await updatePassword({password, confirm_password: confirmPassword});
            toast.success(t.passwordUpdated);
            resetState();
            setIsThridDialogOpen(true);
            setSecondDialogOpen(false);
        } catch (error) {
            const err = error as { status?: number; message?: string };
            toast.error(
                `${t.errorOccurred}: ${err.message || "Something went wrong"}`,
            );
        } finally {
            setLoading(false);
        }
    };
    const navigate = useNavigate();
    return (
        <>
            <Dialog
                open={isFirstDialogOpen}
                onOpenChange={(open) => {
                    setFirstDialogOpen(open);
                    if (!open) resetState();
                }}
            >
                <DialogTrigger asChild>
                    <Badge
                        onClick={() => setFirstDialogOpen(true)}
                        className="bg-red-50 text-red-700 cursor-pointer border-red-200 hover:bg-amber-50 transition-colors duration-300 px-3 py-1"
                    >
                        <Key className="h-3.5 w-3.5 mr-1"/> {t.changePassword}
                    </Badge>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t.confirmation}</DialogTitle>
                        <DialogDescription>{t.confirmChange}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-row justify-center gap-5">
                        <Button
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => {
                                setFirstDialogOpen(false);
                                setSecondDialogOpen(true);
                            }}
                        >
                            {t.yes}
                        </Button>
                        <DialogClose asChild>
                            <Button
                                type="button"
                                className="bg-primary hover:bg-primary/70"
                                tabIndex={2}
                            >
                                {t.no}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={isSecondDialogOpen}
                onOpenChange={(open) => {
                    setSecondDialogOpen(open);
                    if (!open) resetState();
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t.updatePassword}</DialogTitle>
                        <DialogDescription>{t.enterNewPassword}</DialogDescription>
                    </DialogHeader>
                    <div
                        className="bg-white rounded-xl p-5 shadow-md transition-shadow duration-300 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Key className="h-5 w-5 text-primary"/> {t.updatePassword}
                        </h3>
                        <div className="relative mb-4">
                            <Input
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrorMessage(null);
                                }}
                                name="password"
                                value={password}
                                placeholder={t.newPassword}
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-2 rounded-lg border transition focus:ring-2 focus:outline-none border-gray-300 focus:ring-primary"
                                tabIndex={1}
                                onKeyDown={async (e) => {
                                    if (e.key === "Enter") {
                                        await handleConfirmPassword();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 transition"
                                tabIndex={0}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5"/>
                                ) : (
                                    <Eye className="h-5 w-5"/>
                                )}
                            </button>
                        </div>
                        <div className="relative mb-2">
                            <Input
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setErrorMessage(null);
                                }}
                                name="confirmPassword"
                                value={confirmPassword}
                                placeholder={t.confirmNewPassword}
                                type={showConfirmPassword ? "text" : "password"}
                                className="w-full px-4 py-2 rounded-lg border transition focus:ring-2 focus:outline-none border-gray-300 focus:ring-primary"
                                tabIndex={2}
                                onKeyDown={async (e) => {
                                    if (e.key === "Enter") {
                                        await handleConfirmPassword();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 transition"
                                tabIndex={0}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5"/>
                                ) : (
                                    <Eye className="h-5 w-5"/>
                                )}
                            </button>
                        </div>

                        {errorMessage && (
                            <p className="text-red-600 text-sm mb-3">{errorMessage}</p>
                        )}

                        <Button
                            onClick={handleConfirmPassword}
                            disabled={!password || !confirmPassword || loading}
                            className="mt-4 w-full text-white font-medium py-2 rounded-lg transition bg-primary"
                            tabIndex={3}
                        >
                            {loading ? "Loading..." : t.savePassword}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={isThridDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ubah password Berhasil</DialogTitle>
                        <DialogDescription>
                            Silahkan Login kembali dengan password baru
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button onClick={() => navigate("/logout")}>Ok</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
