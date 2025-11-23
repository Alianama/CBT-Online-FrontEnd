import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TimerProps {
  timeLeft: number;
  setTimeLeft: (time: (prev: number) => number) => void;
  onTimeUp: () => void;
}

export default function Timer({ timeLeft, setTimeLeft, onTimeUp }: TimerProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [warningTimer, setWarningTimer] = useState(20);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setTimeLeft, onTimeUp]);

  // Effect untuk menangani peringatan 10 menit
  useEffect(() => {
    if (timeLeft === 600) {
      // 10 menit = 600 detik
      setShowWarning(true);
      setWarningTimer(20);
    }
  }, [timeLeft]);

  // Effect untuk timer dialog peringatan
  useEffect(() => {
    if (showWarning && warningTimer > 0) {
      const timer = setTimeout(() => {
        setWarningTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (warningTimer === 0) {
      setShowWarning(false);
    }
  }, [showWarning, warningTimer]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isWarning = timeLeft < 600; // 10 menit
  const isCritical = timeLeft < 300; // 5 menit

  return (
    <>
      <div className="fixed top-4 right-4 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 rounded-lg shadow-lg border">
        <div className="flex items-center gap-2 text-base font-semibold">
          <Clock
            className={`h-5 w-5 ${isWarning ? "text-red-500 animate-pulse" : ""}`}
          />
          <span
            className={`
                        ${isCritical ? "text-red-500 animate-pulse" : ""}
                        ${isWarning ? "text-orange-500" : ""}
                    `}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-orange-500">
              <AlertTriangle className="h-5 w-5" />
              Peringatan
            </DialogTitle>
            <DialogDescription>
              Waktu tersisa 10 menit! Silakan periksa kembali jawaban Anda.
              {warningTimer > 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Peringatan tertutup dalam {warningTimer} detik
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setShowWarning(false)}>Tutup</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
