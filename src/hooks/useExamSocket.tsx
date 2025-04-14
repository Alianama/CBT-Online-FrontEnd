import useWebSocket from "react-use-websocket";
import { useEffect, useState } from "react";

// type MessageBase = {
//   type: string;
// };

type AuthMessage = {
  token: string;
  type: "auth";
};

type InfoUjianPayload = {
  id_peserta: string;
  id_bank: number;
  status_ujian: number;
  kode_bank: string;
  nama_bank: string;
  nama_siswa: string;
  mulai: string | null;
  durasi_ujian: number;
  sisa_timer: number;
};

type SoalPayload = {
  id_soal: string;
  soal: string;
  pilihan: Record<string, string>; // contoh: { a: "Pilihan A", b: "Pilihan B", ... }
};

type JawabanPayload = {
  [id_soal: string]: string; // contoh: { "1": "a" }
};

type ServerMessage =
  | { type: "info-ujian"; payload: InfoUjianPayload }
  | { type: "soal"; payload: SoalPayload }
  | { type: "soal-ujian"; payload: JawabanPayload }
  | { type: "error"; error: string }
  | { type: string; [key: string]: any }; // fallback

const WSS_URL = import.meta.env.VITE_WSS_URL;

export default function useExamSocket(token: string) {
  const [dataUjian, setDataUjian] = useState<InfoUjianPayload | null>(null);
  const [soal, setSoal] = useState<SoalPayload | null>(null);
  const [historyJawaban, setHistoryJawaban] = useState<JawabanPayload>({});
  const [errors, setErrors] = useState<string[]>([]);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WSS_URL,
    {
      onOpen: () => {
        sendJsonMessage({ token, type: "auth" } as AuthMessage);
      },
      shouldReconnect: () => true,
    }
  );

  useEffect(() => {
    if (!lastJsonMessage) return;

    const message = lastJsonMessage as ServerMessage;

    switch (message.type) {
      case "info-ujian":
        setDataUjian(message.payload);
        break;
      case "soal":
        setSoal(message.payload);
        break;
      case "soal-ujian":
        setHistoryJawaban(message.payload);
        break;
      case "error":
        setErrors((prev) => [...prev, message.error]);
        break;
      default:
        console.warn("Unknown message type:", message);
    }
  }, [lastJsonMessage]);

  const kirimJawaban = (id_soal: string, jawaban: string) => {
    sendJsonMessage({ type: "jawab", id_soal, jawaban });
  };

  return {
    dataUjian,
    soal,
    historyJawaban,
    kirimJawaban,
    errors,
    connectionStatus: readyState,
  };
}
