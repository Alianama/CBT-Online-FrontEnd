// // import useWebSocket from "react-use-websocket";
// // import { useCallback, useEffect, useRef, useState } from "react";
// //
// // type AuthMessage = {
// //   token: string;
// //   type: "auth";
// // };
// //
// // type InfoUjianPayload = {
// //   id_peserta: string;
// //   id_bank: number;
// //   status_ujian: number;
// //   kode_bank: string;
// //   nama_bank: string;
// //   nama_siswa: string;
// //   mulai: string | null;
// //   durasi_ujian: number;
// //   sisa_timer: number;
// // };
// //
// // type SoalPayload = {
// //   id_soal: string;
// //   soal: string;
// //   pilihan: Record<string, string>;
// // };
// //
// // type JawabanPayload = {
// //   [id_soal: string]: string;
// // };
// //
// // type ServerMessage =
// //     | { type: "auth-success" }
// //     | { type: "auth-failed"; error: string }
// //     | { type: "info-ujian"; payload: InfoUjianPayload }
// //     | { type: "soal"; payload: SoalPayload }
// //     | { type: "soal-ujian"; payload: JawabanPayload }
// //     | { type: "error"; error: string }
// //     | { type: string; [key: string]: any };
// //
// // const WSS_URL = import.meta.env.VITE_WSS_URL;
// //
// // export default function useExamSocket(token: string) {
// //   const [dataUjian, setDataUjian] = useState<InfoUjianPayload | null>(null);
// //   const [soal, setSoal] = useState<SoalPayload | null>(null);
// //   const [historyJawaban, setHistoryJawaban] = useState<JawabanPayload>({});
// //   const [isAuthenticated, setIsAuthenticated] = useState(false);
// //   const [errors, setErrors] = useState<string[]>([]);
// //
// //   const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WSS_URL, {
// //     onOpen: () => {
// //       // Kirim auth hanya sekali
// //       if (!authSentRef.current) {
// //         sendJsonMessage({ token, type: "auth" } as AuthMessage);
// //         authSentRef.current = true;
// //       }
// //     },
// //     shouldReconnect: () => true,
// //   });
// //
// //   const authSentRef = useRef(false); // Cegah pengiriman ulang auth
// //   const soalRequestedRef = useRef(false); // Cegah pengiriman ulang soal
// //
// //   useEffect(() => {
// //     if (!lastJsonMessage) return;
// //
// //     const message = lastJsonMessage as ServerMessage;
// //
// //     switch (message.type) {
// //       case "auth-success":
// //         setIsAuthenticated(true);
// //         break;
// //
// //       case "auth-failed":
// //         setIsAuthenticated(false);
// //         setErrors((prev) => [...prev, message.error || "Autentikasi gagal"]);
// //         break;
// //
// //       case "info-ujian":
// //         setDataUjian(message.payload);
// //         break;
// //
// //       case "soal":
// //         setSoal(message.payload);
// //         break;
// //
// //       case "soal-ujian":
// //         setHistoryJawaban(message.payload);
// //         break;
// //
// //       case "error":
// //         setErrors((prev) => [...prev, message.error]);
// //         break;
// //
// //       default:
// //         console.warn("Unknown message type:", message);
// //     }
// //   }, [lastJsonMessage]);
// //
// //   const requestSoal = useCallback(() => {
// //     if (isAuthenticated && !soalRequestedRef.current) {
// //       sendJsonMessage({ type: "soal" });
// //       soalRequestedRef.current = true;
// //     } else if (!isAuthenticated) {
// //       console.warn("Belum terautentikasi, tidak bisa ambil soal.");
// //     }
// //   }, [isAuthenticated, sendJsonMessage]);
// //
// //   const kirimJawaban = (id_soal: string, jawaban: string) => {
// //     sendJsonMessage({ type: "jawab", id_soal, jawaban });
// //   };
// //
// //   return {
// //     dataUjian,
// //     soal,
// //     historyJawaban,
// //     kirimJawaban,
// //     requestSoal,
// //     isAuthenticated,
// //     errors,
// //     connectionStatus: readyState,
// //   };
// // }
//
// import useWebSocket from "react-use-websocket";
// import { useEffect, useRef, useState } from "react";
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
// type SoalPayload = {
//   soal_ujian: any[];
//   history_jawaban: object;
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
//     | { type: "error"; error: string; code?: number } // ✅ Ditambahkan kode error opsional
//     | { type: string; payload?: any; error?: any };    // ✅ Fallback generic handler (misal untuk log debug)
//
//
//
// const WSS_URL = import.meta.env.VITE_WSS_URL;
//
// export const useExamSocket = (token: string) => {
//   const authSentRef = useRef(false);
//   const [dataUjian, setDataUjian] = useState<InfoUjianPayload | null>(null);
//   const [soal, setSoal] = useState<SoalPayload | null>(null);
//   // const [historyJawaban, setHistoryJawaban] = useState<JawabanPayload>({});
//   const [errors, setErrors] = useState<string[]>([]);
//   const navigate = useNavigate();
//
//   const {
//     sendJsonMessage,
//     lastJsonMessage,
//     readyState,
//     getWebSocket,
//   } = useWebSocket(WSS_URL, {
//     onOpen: () => {
//       console.log('✅ WebSocket connected');
//       if (!authSentRef.current) {
//         sendJsonMessage({ token, type: "auth" } as AuthMessage);
//         sendJsonMessage({type: "soal"})
//           console.log(lastJsonMessage)
//          
//        
//         console.log('📨 Auth message sent');
//         authSentRef.current = true;
//       }
//     },
//     onClose: () => {
//       console.log('❌ WebSocket disconnected');
//       authSentRef.current = false; // Reset auth status on disconnect
//     },
//     onError: (err) => {
//       console.error('🔥 WebSocket error', err);
//     },
//     shouldReconnect: () => {
//       console.log('🔁 Attempting to reconnect...');
//       return true;
//     },
//     reconnectAttempts: 10,
//     reconnectInterval: 3000,
//   });
//
//   // useEffect(() => {
//   //   if (!lastJsonMessage) return;
//   //  
//   //   console.log('📩 Received:', JSON.stringify(lastJsonMessage));
//   // }, [lastJsonMessage]);
//   useEffect(() => {
//     if (!lastJsonMessage) return;
//
//     const message = lastJsonMessage as ServerMessage;
//
//     switch (message.type) {
//       case "auth-failed":
//         setErrors((prev) => [...prev, message.error || "Autentikasi gagal"]);
//         break;
//
//       case "info-ujian":
//         setDataUjian(message.payload);
//         break;
//
//       case "soal-ujian":
//         setSoal(message.payload);
//         break;
//
//       // case "error":
//       //   setErrors((prev) => [...prev, message.error]);
//       //   navigate("/exam")
//       //   break;
//
//       default:
//         console.warn("Unknown message type:", message);
//     }
//     if(message?.error){
//      
//     }
//     console.log('📩 Received:', JSON.stringify(lastJsonMessage));
//   }, [lastJsonMessage]);
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


import { useEffect, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useNavigate } from "react-router-dom";
import {
  AuthMessage,
  ErrorMessage,
  InfoUjianMessage,
  SoalMessage,
  WSMessage,
} from "@/types/WSMessage";
const WSS_URL = import.meta.env.VITE_WSS_URL;

const useExamSocket = (token: string | null) => {
  const [dataUjian, setDataUjian] = useState<InfoUjianMessage["payload"] | null>(null);
  const [soal, setSoal] = useState<SoalMessage["payload"] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authSentRef = useRef(false);
  const soalRequestedRef = useRef(false);

  const navigate = useNavigate();

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
      WSS_URL,
      {
        onOpen: () => {
          console.log("✅ WebSocket connected");

          // Kirim auth hanya sekali
          if (!authSentRef.current && token) {
            sendJsonMessage({ token, type: "auth" } as AuthMessage);
            authSentRef.current = true;
            console.log("📨 Auth message sent");
          }
        },
        shouldReconnect: () => true, // otomatis reconnect
        reconnectAttempts: 5,
        reconnectInterval: 3000,
      }
  );

  // Tangani pesan masuk dari server
  useEffect(() => {
    if (!lastJsonMessage) return;

    const message = lastJsonMessage as WSMessage;

    switch (message.type) {
      case "info-ujian":
        setDataUjian(message.payload);
        break;

      case "soal":
        setSoal(message.payload);
        break;

      case "error":
        console.error("❌ Error:", message.error);
        setErrors((prev) => [...prev, message.error]);
        
        if (message.error) {
          console.warn("⚠️ Token invalid/expired. Resetting auth state...");
          setIsAuthenticated(false);
          authSentRef.current = false;
          soalRequestedRef.current = false;
          
          navigate("/exam");
        }
        break;

      case "auth-success":
        console.log("✅ Authenticated");
        setIsAuthenticated(true);
        break;

      case "auth-failed":
        setErrors((prev) => [...prev, message.error || "Auth gagal"]);
        setIsAuthenticated(false);
        soalRequestedRef.current = false;
        break;

      default:
        break;
    }
  }, [lastJsonMessage]);
  
  useEffect(() => {
    if (isAuthenticated && !soalRequestedRef.current) {
      sendJsonMessage({ type: "soal" });
      soalRequestedRef.current = true;
      console.log("🧠 Requesting soal...");
    }
  }, [sendJsonMessage, isAuthenticated]);

  return {
    setDataUjian,
    sendJsonMessage,
    dataUjian,
    soal,
    errors,
    readyState,
    isConnected: readyState === ReadyState.OPEN,
  };
};

export {useExamSocket};
