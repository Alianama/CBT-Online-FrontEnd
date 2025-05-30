import { sendLogUjian } from "@/app/api/api-cbt";

interface ExamActivity {
  type: "exit" | "tab" | "refresh";
  timestamp: number;
}

class ExamActivityTracker {
  private activities: ExamActivity[] = [];
  private isTracking: boolean = false;
  private id_peserta: number | null = null;
  private readonly PENDING_ACTIVITY_KEY = "pending_exam_activity";
  private readonly WS_TOKEN_KEY = "wsToken";
  private readonly EXAM_PAGE_PATH = "/exam/start";

  constructor() {
    this.activities = [];
    this.isTracking = false;
    this.id_peserta = Number(localStorage.getItem("id_peserta"));
  }

  setPesertaId(id: number) {
    this.id_peserta = id;
    localStorage.setItem("id_peserta", id.toString());
  }

  startTracking() {
    if (this.isTracking) return;

    // Cek dan kirim aktivitas yang tertunda
    this.checkAndSendPendingActivity();

    // Deteksi tab switch
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        const activity: ExamActivity = {
          type: "tab",
          timestamp: Date.now(),
        };
        this.logActivity(activity);
      }
    });

    // Deteksi refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      const activity: ExamActivity = {
        type: "refresh",
        timestamp: Date.now(),
      };

      // Simpan aktivitas ke localStorage sebelum refresh
      localStorage.setItem(
        this.PENDING_ACTIVITY_KEY,
        JSON.stringify({
          activity,
          id_peserta: this.id_peserta,
        })
      );

      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Deteksi keluar dari ExamPage
    const checkExit = () => {
      const wsToken = localStorage.getItem(this.WS_TOKEN_KEY);
      const currentPath = window.location.pathname;

      // Jika bukan di halaman exam dan masih ada wsToken
      if (wsToken && this.id_peserta && currentPath !== this.EXAM_PAGE_PATH) {
        const activity: ExamActivity = {
          type: "exit",
          timestamp: Date.now(),
        };
        this.logActivity(activity);
      }
    };

    // Jalankan pengecekan saat halaman dimuat
    checkExit();

    // Tambahkan event listener untuk perubahan route
    window.addEventListener("popstate", checkExit);

    // Tambahkan event listener untuk click pada link
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (link) {
        // Tunggu navigasi selesai
        setTimeout(checkExit, 100);
      }
    });

    this.isTracking = true;
  }

  private async checkAndSendPendingActivity() {
    const pendingActivity = localStorage.getItem(this.PENDING_ACTIVITY_KEY);
    if (pendingActivity) {
      try {
        const { activity, id_peserta } = JSON.parse(pendingActivity);
        if (id_peserta) {
          await sendLogUjian({
            reason: activity.type,
            id_peserta: id_peserta,
          });
        }
      } catch (error) {
        console.error("Gagal mengirim aktivitas tertunda:", error);
      } finally {
        localStorage.removeItem(this.PENDING_ACTIVITY_KEY);
      }
    }
  }

  stopTracking() {
    if (!this.isTracking) return;

    document.removeEventListener("visibilitychange", () => {});
    window.removeEventListener("beforeunload", () => {});
    window.removeEventListener("popstate", () => {});
    document.removeEventListener("click", () => {});

    this.isTracking = false;
  }

  private async logActivity(activity: ExamActivity) {
    this.activities.push(activity);

    if (this.id_peserta) {
      try {
        await sendLogUjian({
          reason: activity.type,
          id_peserta: this.id_peserta,
        });
      } catch (error) {
        console.error("Gagal mengirim log aktivitas:", error);
      }
    }
  }

  // Method public untuk log aktivitas
  async logExamActivity(activity: ExamActivity) {
    await this.logActivity(activity);
  }

  getActivities(): ExamActivity[] {
    return this.activities;
  }

  clearActivities() {
    this.activities = [];
  }
}

export const examActivityTracker = new ExamActivityTracker();
