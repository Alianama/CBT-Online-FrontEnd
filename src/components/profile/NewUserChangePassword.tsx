import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import { Eye, EyeOff, Key, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { updatePassword } from "@/app/api/api-cbt.ts";
import { toast } from "sonner";
import LanguageContext from "@/context/LanguageContext.tsx";
import { useNavigate } from "react-router-dom";
import { getAuthData, setUserData } from "@/utils/storage.ts";

interface NewUserChangePasswordProps {
  open: boolean;
  onSuccess: () => void;
}

export default function NewUserChangePassword({
  open,
  onSuccess,
}: NewUserChangePasswordProps) {
  const { locale } = useContext(LanguageContext);
  const navigate = useNavigate();

  const translations = {
    id: {
      newUserTitle: "Ganti Password Wajib",
      newUserDescription:
        "Anda adalah pengguna baru. Silakan ganti password Anda untuk keamanan akun.",
      newPassword: "Masukkan password baru",
      confirmNewPassword: "Konfirmasi password baru",
      updatePassword: "Ubah Password",
      enterNewPassword: "Masukkan password baru untuk memperbarui akun Anda.",
      savePassword: "Simpan Password",
      passwordMismatch: "Password tidak cocok",
      passwordUpdated: "Password berhasil diperbarui",
      errorOccurred: "Terjadi kesalahan",
      successChangePassword: "Ubah Password Berhasil",
      successChangePassword2: "Silahkan login kembali dengan password baru!",
      ok: "Ok",
      loading: "Loading...",
      passwordRequirements:
        "Password harus minimal 8 karakter, mengandung huruf dan angka",
      minCharacters: "Minimal 8 karakter",
      mustContainLetter: "Harus mengandung huruf",
      mustContainNumber: "Harus mengandung angka",
    },
    en: {
      newUserTitle: "Mandatory Password Change",
      newUserDescription:
        "You are a new user. Please change your password for account security.",
      newPassword: "Enter new password",
      confirmNewPassword: "Confirm new password",
      updatePassword: "Update Password",
      enterNewPassword: "Enter a new password to update your account.",
      savePassword: "Save Password",
      passwordMismatch: "Passwords do not match",
      passwordUpdated: "Password updated successfully",
      errorOccurred: "An error occurred",
      successChangePassword: "Change Password successfully",
      successChangePassword2: "Please re login with new password!",
      ok: "Ok",
      loading: "Loading...",
      passwordRequirements:
        "Password must be at least 8 characters, containing letters and numbers",
      minCharacters: "Minimum 8 characters",
      mustContainLetter: "Must contain letters",
      mustContainNumber: "Must contain numbers",
    },
  };

  const t = translations[locale as keyof typeof translations];
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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

  const isPasswordValid = (pwd: string) => {
    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    return pwd.length >= 8 && hasLetter && hasNumber;
  };

  const getValidationMessage = (pwd: string) => {
    const validations = [];
    if (pwd.length < 8) validations.push(t.minCharacters);
    if (!/[a-zA-Z]/.test(pwd)) validations.push(t.mustContainLetter);
    if (!/[0-9]/.test(pwd)) validations.push(t.mustContainNumber);
    return validations;
  };

  const handleConfirmPassword = async () => {
    setLoading(true);
    if (!isPasswordValid(password)) {
      setErrorMessage(t.passwordRequirements);
      toast.error(t.passwordRequirements);
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(t.passwordMismatch);
      toast.error(t.passwordMismatch);
      setLoading(false);
      return;
    }
    try {
      await updatePassword({ password, confirm_password: confirmPassword });

      // Update user data di localStorage untuk mengubah new_user menjadi 0
      const authData = getAuthData();
      if (authData?.userData) {
        const updatedUserData = {
          ...authData.userData,
          new_user: 0,
        };
        setUserData(updatedUserData);
      }

      toast.success(t.passwordUpdated);
      resetState();
      setShowSuccessModal(true);
      onSuccess();
    } catch (error) {
      const err = error as { status?: number; message?: string };
      toast.error(
        `${t.errorOccurred}: ${err.message || "Something went wrong"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccessModal(false);
    navigate("/logout");
  };

  return (
    <>
      {/* Modal ganti password untuk new user - tidak bisa ditutup */}
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent
          className="max-w-md"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-600" />
              {t.newUserTitle}
            </DialogTitle>
            <DialogDescription>{t.newUserDescription}</DialogDescription>
          </DialogHeader>
          <div className="bg-white rounded-xl p-5 shadow-md transition-shadow duration-300 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" /> {t.updatePassword}
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 transition"
                tabIndex={0}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
              <ul className="text-sm mt-1 ml-1 text-gray-600 list-disc pl-5">
                {getValidationMessage(password).map((msg, idx) => (
                  <li
                    key={idx}
                    className={password.includes(msg) ? "text-green-600" : ""}
                  >
                    {msg}
                  </li>
                ))}
              </ul>
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
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
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
              {loading ? t.loading : t.savePassword}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal konfirmasi berhasil */}
      <Dialog open={showSuccessModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-600" />
              {t.successChangePassword}
            </DialogTitle>
            <DialogDescription>{t.successChangePassword2}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <Button
              onClick={handleSuccessOk}
              className="bg-primary hover:bg-primary/70"
            >
              {t.ok}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
