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
import {useState} from "react";
import {Eye, EyeOff, Key} from "lucide-react";
import {Input} from "@/components/ui/input";

export default function ChangePassword() {
    const [isFirstDialogOpen, setFirstDialogOpen] = useState(false);
    const [isSecondDialogOpen, setSecondDialogOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const resetState = () => {
        setPassword("");
        setConfirmPassword("");
        setErrorMessage(null);
        setShowPassword(false);
        setShowConfirmPassword(false);
    };
    const handleOpenFirstDialog = () => {
        setFirstDialogOpen(true);
    };
    const handleConfirmPassword = () => {
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
        } else {
            setErrorMessage(null);
            setSecondDialogOpen(false);
            alert("Password berhasil diperbarui!");
        }
    };
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
                        onClick={handleOpenFirstDialog}
                        className="bg-blue-50 text-blue-700 cursor-pointer border-blue-200 hover:bg-emerald-100 transition-colors duration-300 px-3 py-1"
                    >
                        <Key className="h-3.5 w-3.5 mr-1"/> Ganti Password
                    </Badge>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Konfirmasi</DialogTitle>
                        <DialogDescription>
                            Apakah Anda yakin ingin mengganti password?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex flex-row justify-center gap-5">
                        <Button
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => {
                                setFirstDialogOpen(false);
                                setSecondDialogOpen(true);
                            }}
                        >
                            Ya
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" className="bg-primary hover:bg-primary/70">
                                Tidak
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
                        <DialogTitle>Ubah Password</DialogTitle>
                        <DialogDescription>Masukkan password baru Anda.</DialogDescription>
                    </DialogHeader>

                    <div
                        className="bg-white rounded-xl p-5 shadow-md transition-shadow duration-300 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <Key className="h-5 w-5 text-primary"/> Ubah Password
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                            Masukkan password baru untuk memperbarui akun Anda.
                        </p>

                        {/* Input Password */}
                        <div className="relative mb-4">
                            <Input
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setErrorMessage(null);
                                }}
                                value={password}
                                placeholder="Masukkan password baru"
                                type={showPassword ? "text" : "password"}
                                className={`w-full px-4 py-2 rounded-lg border transition focus:ring-2 focus:outline-none 
                                    ${errorMessage ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-primary"}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 transition"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                            </button>
                        </div>
                        <div className="relative mb-2">
                            <Input
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setErrorMessage(null);
                                }}
                                value={confirmPassword}
                                placeholder="Konfirmasi password baru"
                                type={showConfirmPassword ? "text" : "password"}
                                className={`w-full px-4 py-2 rounded-lg border transition focus:ring-2 focus:outline-none 
                                    ${errorMessage ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-primary"}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-2 text-gray-500 hover:text-gray-700 transition"
                            >
                                {showConfirmPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
                            </button>
                        </div>
                        {errorMessage && <p className="text-red-600 text-sm mb-3">{errorMessage}</p>}
                        <Button
                            onClick={handleConfirmPassword}
                            disabled={!password || !confirmPassword}
                            className={`mt-4 w-full bg-primary text-white font-medium py-2 rounded-lg transition ${
                                !password || !confirmPassword
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:bg-indigo-600"
                            }`}
                        >
                            Simpan Password
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
