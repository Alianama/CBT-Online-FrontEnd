// import useWebSocket from "react-use-websocket";
// import { useCallback, useEffect, useRef, useState } from "react";
//
// type AuthMessage = {
//   token: string;
//   type: "auth";
// };
//
// type InfoUjianPayload = {
//   id_peserta: string;
//   id_bank: number;
//   status_ujian: number;
//   kode_bank: string;
//   nama_bank: string;
//   nama_siswa: string;
//   mulai: string | null;
//   durasi_ujian: number;
//   sisa_timer: number;
// };
//
// type SoalPayload = {
//   id_soal: string;
//   soal: string;
//   pilihan: Record<string, string>;
// };
//
// type JawabanPayload = {
//   [id_soal: string]: string;
// };
//
// type ServerMessage =
//     | { type: "auth-success" }
//     | { type: "auth-failed"; error: string }
//     | { type: "info-ujian"; payload: InfoUjianPayload }
//     | { type: "soal"; payload: SoalPayload }
//     | { type: "soal-ujian"; payload: JawabanPayload }
//     | { type: "error"; error: string }
//     | { type: string; [key: string]: any };
//
// const WSS_URL = import.meta.env.VITE_WSS_URL;
//
// export default function useExamSocket(token: string) {
//   const [dataUjian, setDataUjian] = useState<InfoUjianPayload | null>(null);
//   const [soal, setSoal] = useState<SoalPayload | null>(null);
//   const [historyJawaban, setHistoryJawaban] = useState<JawabanPayload>({});
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [errors, setErrors] = useState<string[]>([]);
//
//   const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WSS_URL, {
//     onOpen: () => {
//       if (!authSentRef.current) {
//         sendJsonMessage({ token, type: "auth" } as AuthMessage);
//         authSentRef.current = true;
//       }
//     },
//     shouldReconnect: () => true,
//   });
//
//   const authSentRef = useRef(false); // Cegah pengiriman ulang auth
//   const soalRequestedRef = useRef(false); // Cegah pengiriman ulang soal
//
//   useEffect(() => {
//     if (!lastJsonMessage) return;
//
//     const message = lastJsonMessage as ServerMessage;
//
//     switch (message.type) {
//       case "auth-success":
//         setIsAuthenticated(true);
//         break;
//
//       case "auth-failed":
//         setIsAuthenticated(false);
//         setErrors((prev) => [...prev, message.error || "Autentikasi gagal"]);
//         break;
//
//       case "info-ujian":
//         setDataUjian(message.payload);
//         break;
//
//       case "soal":
//         setSoal(message.payload);
//         break;
//
//       case "soal-ujian":
//         setHistoryJawaban(message.payload);
//         break;
//
//       case "error":
//         setErrors((prev) => [...prev, message.error]);
//         break;
//
//       default:
//         console.warn("Unknown message type:", message);
//     }
//   }, [lastJsonMessage]);
//
//   const requestSoal = useCallback(() => {
//     if (isAuthenticated && !soalRequestedRef.current) {
//       sendJsonMessage({ type: "soal" });
//       soalRequestedRef.current = true;
//     } else if (!isAuthenticated) {
//       console.warn("Belum terautentikasi, tidak bisa ambil soal.");
//     }
//   }, [isAuthenticated, sendJsonMessage]);
//
//   const kirimJawaban = (id_soal: string, jawaban: string) => {
//     sendJsonMessage({ type: "jawab", id_soal, jawaban });
//   };
//
//   return {
//     dataUjian,
//     soal,
//     historyJawaban,
//     kirimJawaban,
//     requestSoal,
//     isAuthenticated,
//     errors,
//     connectionStatus: readyState,
//   };
// }

// import useWebSocket from "react-use-websocket";
// import { useEffect, useRef, useState } from "react";
// import { useGlobal } from "@/context/GlobalContext.tsx";
// import {QuestionType} from "@/types/types.ts";
// import {useNavigate} from "react-router-dom";
//
// type AuthMessage = {
//   token: string;
//   type: "auth";
//   error: string;
// };
//
// type InfoUjianPayload = {
//   id_peserta: string;
//   id_bank: number;
//   status_ujian: number;
//   kode_bank: string;
//   nama_bank: string;
//   nama_siswa: string;
//   mulai: string | null;
//   durasi_ujian: number;
//   sisa_timer: number;
// };
//
// type JawabanPayload = {
//   [id_soal: string]: string;
// };
//
// type ServerMessage =
//   | { type: "info-ujian"; payload: InfoUjianPayload }
//   | { type: "soal" }
//   | { type: "soal-ujian"; payload: JawabanPayload }
//   | { type: "error"; error: string; code?: number }
//   | { type: string; payload?: any; error?: any };
//
// const WSS_URL = import.meta.env.VITE_WSS_URL;
//
// export const useExamSocket = () => {
//   const authSentRef = useRef(false);
//   const soalRequestedRef = useRef(false);
//   const [dataUjian, setDataUjian] = useState<InfoUjianPayload | null>(null);
//   const [soal, setSoal] = useState<QuestionType[] | [] >([]);
//   const [errors, setErrors] = useState<string[]>([]);
//   const { wsToken } = useGlobal();
//   const navigate = useNavigate();
//
//   const {
//     sendJsonMessage,
//     lastJsonMessage,
//     readyState,
//     getWebSocket,
//   } = useWebSocket(WSS_URL, {
//     onOpen: () => {
//       console.log("✅ WebSocket connected");
//       if (!authSentRef.current) {
//         sendJsonMessage({ token: wsToken, type: "auth" } as AuthMessage);
//         console.log("📨 Auth message sent");
//         authSentRef.current = true;
//       }
//     },
//     onClose: () => {
//       console.log("❌ WebSocket disconnected");
//       authSentRef.current = false;
//     },
//     onError: (err) => {
//       console.error("🔥 WebSocket error", err);
//     },
//     shouldReconnect: () => {
//       console.log("🔁 Attempting to reconnect...");
//       return true;
//     },
//     reconnectAttempts: 10,
//     reconnectInterval: 3000,
//   });
//
//   useEffect(() => {
//     if (!lastJsonMessage) return;
//     const message = lastJsonMessage as ServerMessage;
//
//     if ("error" in message && message.error) {
//       console.error("⚠️ Server error:", message.error);
//       if(message.error === "No token provided") {
//         navigate("/exam")
//       }
//       setErrors((prev) => [...prev, message.error]);
//       return;
//     }
//
//     if (message.type === "info-ujian") {
//       setDataUjian(message.payload);
//       if (!soalRequestedRef.current && readyState === WebSocket.OPEN) {
//         sendJsonMessage({ type: "soal" });
//         soalRequestedRef.current = true;
//         console.log("📨 Requesting soal for the first time...");
//       }
//     } else if (message.type === "soal-ujian") {
//       setSoal(message.payload);
//     } else {
//       console.warn("⚠️ Unknown message type:", message);
//     }
//   }, [lastJsonMessage, navigate, readyState, sendJsonMessage]);
//
//   return {
//     errors,
//     dataUjian,
//     soal,
//     sendJsonMessage,
//     lastJsonMessage,
//     readyState,
//     getWebSocket,
//   };
// };


import useWebSocket from "react-use-websocket";
import { useEffect, useRef, useState } from "react";
import { useGlobal } from "@/context/GlobalContext.tsx";
import { QuestionType } from "@/types/types.ts";
import { useNavigate } from "react-router-dom";

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

// type JawabanPayload = {
//   [id_soal: string]: string;
// };

type ServerMessage =
    | { type: "info-ujian"; payload: InfoUjianPayload }
    | { type: "soal-ujian"; payload: QuestionType[] }
    | { type: "error"; error: string; code?: number }
    | { type: string; payload?: any; error?: any };

const WSS_URL = import.meta.env.VITE_WSS_URL;

export const useExamSocket = () => {
  const authSentRef = useRef(false);
  const soalRequestedRef = useRef(false);
  const jawabanSentRef = useRef<Record<number, string>>({});
  const [dataUjian, setDataUjian] = useState<InfoUjianPayload | null>(null);
  const [soal, setSoal] = useState<QuestionType[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const { wsToken } = useGlobal();
  const navigate = useNavigate();

  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
  } = useWebSocket(WSS_URL, {
    onOpen: () => {
      console.log("✅ WebSocket connected");
      if (!authSentRef.current) {
        sendJsonMessage({ token: wsToken, type: "auth" } as AuthMessage);
        console.log("📨 Auth message sent");
        authSentRef.current = true;
      }
    },
    onClose: () => {
      console.log("❌ WebSocket disconnected");
      authSentRef.current = false;
    },
    onError: (err) => {
      console.error("🔥 WebSocket error", err);
    },
    shouldReconnect: () => {
      console.log("🔁 Attempting to reconnect...");
      return true;
    },
    reconnectAttempts: 10,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    if (!lastJsonMessage) return;
    const message = lastJsonMessage as ServerMessage;

    if ("error" in message && message.error) {
      console.error("⚠️ Server error:", message.error);
      if (message.error === "No token provided") {
        navigate("/exam");
      }
      setErrors((prev) => [...prev, message.error]);
      return;
    }

    if (message.type === "info-ujian") {
      setDataUjian(message.payload);
      if (!soalRequestedRef.current && readyState === WebSocket.OPEN) {
        sendJsonMessage({ type: "soal" });
        soalRequestedRef.current = true;
        console.log("📨 Requesting soal for the first time...");
      }
    } else if (message.type === "soal-ujian") {
      setSoal(message.payload);
    } else {
      console.warn("⚠️ Unknown message type:", message);
    }
  }, [lastJsonMessage, navigate, readyState, sendJsonMessage]);


  const sendJawaban = (id_soal: number, jawaban: string) => {
    if (readyState !== WebSocket.OPEN) {
      console.warn("⚠️ WebSocket not connected. Cannot send jawaban.");
      return;
    }

    if (jawabanSentRef.current[id_soal] === jawaban) {
      console.log("📭 Jawaban sudah dikirim, tidak mengirim ulang.");
      return;
    }
    // console.log(id_soal, jawaban);

    sendJsonMessage({
      type: "jawab",
      id_soal_ujian: id_soal,
      jawaban,
    });

    jawabanSentRef.current[id_soal] = jawaban;
    console.log(`✅ Jawaban dikirim untuk soal ${id_soal}: ${jawaban}`);
  };
  
  const sendTimer = (sisa_timer: number) => {
    if (readyState !== WebSocket.OPEN) {
      console.warn("⚠️ WebSocket not connected. Cannot send timer.");
      return;
    }

    sendJsonMessage({
      type: "timer",
      sisa: sisa_timer,
    });

    console.log(`⏱️ Timer dikirim: ${sisa_timer} detik`);
  };

  // 📤 Submit ujian
  const submitUjian = () => {
    if (readyState !== WebSocket.OPEN) {
      console.warn("⚠️ WebSocket not connected. Cannot submit ujian.");
      return;
    }

    sendJsonMessage({
      type: "submit",
    });

    console.log("📤 Submit ujian dikirim");
  };

  // Optional: kirim waktu sisa setiap 30 detik
  useEffect(() => {
    const interval = setInterval(() => {
      if (dataUjian?.sisa_timer != null) {
        sendTimer(dataUjian.sisa_timer);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [dataUjian?.sisa_timer, sendTimer]);

  return {
    errors,
    dataUjian,
    soal,
    sendJsonMessage,
    lastJsonMessage,
    readyState,
    getWebSocket,
    sendJawaban,
    sendTimer,
    submitUjian,
  };
};
