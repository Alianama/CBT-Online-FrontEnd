import { useEffect } from "react";
import { examActivityTracker } from "@/utils/examActivityTracker";

export default function ExamActivityCheck() {
  useEffect(() => {
    // Cek aktivitas ujian saat komponen dimuat
    const checkExit = async () => {
      const wsToken = localStorage.getItem("wsToken");
      const id_peserta = localStorage.getItem("id_peserta");
      const currentPath = window.location.pathname;

      if (wsToken && id_peserta && currentPath !== "/exam/start") {
        const activity = {
          type: "exit" as const,
          timestamp: Date.now(),
        };

        await examActivityTracker.logExamActivity(activity);
      }
    };

    // Jalankan pengecekan saat komponen dimuat
    checkExit();

    // Tambahkan event listener untuk perubahan route
    window.addEventListener("popstate", checkExit);

    // Tambahkan event listener untuk click pada link
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (link) {
        setTimeout(checkExit, 100);
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("popstate", checkExit);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}
