import {  Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { toast, Toaster } from "sonner";
import Dashboard from "@/pages/Dashboard";
import Home from "@/pages/Home";

// 🔹 Variabel global untuk mengontrol mode keamanan
const isSecurityEnabled :boolean = true;

export default function App() {


  // Fungsi untuk menampilkan toast
  const showToast = (message: string) => {
    toast.error(message, {
      action: {
        label: "OK",
        onClick: () => console.log("User acknowledged the warning"),
      },
    });
  };

  // Fungsi untuk menonaktifkan klik kanan
  const disableRightClick = useCallback((e: MouseEvent) => {
    if (!isSecurityEnabled) return;
    e.preventDefault();
    showToast("Klik kanan tidak diperbolehkan!");
  }, []);

  // Fungsi untuk menonaktifkan shortcut tertentu
  const disableShortcut = useCallback((e: KeyboardEvent) => {
    if (!isSecurityEnabled) return;

    const forbiddenKeys = ["u", "i", "c", "x", "v", "s", "j", "k", "f12"];
    if (
      e.ctrlKey && forbiddenKeys.includes(e.key.toLowerCase()) ||
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["i", "c", "j"].includes(e.key.toLowerCase()))
    ) {
      e.preventDefault();
      showToast("Shortcut ini tidak diperbolehkan!");
    }
  }, []);

  // Fungsi untuk mendeteksi DevTools terbuka
  const navigate = useNavigate();

  const detectDevTools = useCallback(() => {
    if (!isSecurityEnabled) return;

    const threshold: number = 160; // Ukuran minimum DevTools
    const checkDevTools = () => {
      if (
        window.outerWidth - window.innerWidth > threshold ||
        window.outerHeight - window.innerHeight > threshold
      ) {
        toast.error("Mode pengembang terdeteksi! Mengalihkan halaman...");
        setTimeout(() => {
          navigate("/fokus");
        }, 0);
      }
    };

    window.addEventListener("resize", checkDevTools);
    checkDevTools();

    return () => window.removeEventListener("resize", checkDevTools);
  }, [navigate]); // Tambahkan dependensi navigate

  useEffect(() => {
    detectDevTools();
  }, [detectDevTools]);

  useEffect(() => {
    if (isSecurityEnabled) {
      document.addEventListener("contextmenu", disableRightClick);
      document.addEventListener("keydown", disableShortcut);
      window.addEventListener("resize", detectDevTools);

    } else {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", disableShortcut);
      window.removeEventListener("resize", detectDevTools);
    }

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", disableShortcut);
      window.removeEventListener("resize", detectDevTools);
    };
  }, []);

  return (
    <>
      <Toaster position="top-right" richColors />

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Home />} />
        </Routes>

    </>
  );
}
