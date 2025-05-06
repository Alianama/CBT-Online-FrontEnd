// import useWebSocket from "react-use-websocket";
// import { useEffect, useRef, useState, useCallback } from "react";
// import { useGlobal } from "@/context/GlobalContext";
// import { QuestionType } from "@/types/types";
// import { useNavigate } from "react-router-dom";
// // import useResultSubmitUjian from "@/stores/useResultSubmitUjian";
//
// type AuthMessage = {
//     token: string;
//     type: "auth";
// };
//
// type InfoUjianPayload = {
//     id_peserta: string;
//     id_bank: number;
//     status_ujian: number;
//     kode_bank: string;
//     nama_bank: string;
//     nama_siswa: string;
//     mulai: string | null;
//     durasi_ujian: number;
//     sisa_timer: number;
// };
//
// type ServerMessage =
//     | { type: "info-ujian"; payload: InfoUjianPayload }
//     | { type: "soal-ujian"; payload: QuestionType[] }
//     | { type: "error"; error: string; code?: number }
//     | { type: string; payload?: any; error?: any };
//
// const WSS_URL = import.meta.env.VITE_WSS_URL;
//
// export const useExamSocket = () => {
//     const authSentRef = useRef(false);
//     const soalRequestedRef = useRef(false);
//     const jawabanSentRef = useRef<Record<number, string>>({});
//     const [dataUjian, setDataUjian] = useState<InfoUjianPayload | null>(null);
//     const [soal, setSoal] = useState<QuestionType[]>([]);
//     const [soalReady, setSoalReady] = useState<boolean>(false);
//     const [errors, setErrors] = useState<string[]>([]);
//     const [timer, setTimer] = useState<number | null>(null);
//
//     const { wsToken } = useGlobal();
//     const navigate = useNavigate();
//
//     const resetTimer = useCallback(() => {
//         setTimer(null);
//         localStorage.removeItem("soal-timer");
//     }, []);
//
//     const {
//         sendJsonMessage,
//         lastJsonMessage,
//         readyState,
//         getWebSocket,
//     } = useWebSocket(WSS_URL, {
//         onOpen: () => {
//             console.log("✅ WebSocket connected");
//             if (!authSentRef.current) {
//                 sendJsonMessage({ token: wsToken, type: "auth" } as AuthMessage);
//                 console.log("📨 Auth message sent");
//                 authSentRef.current = true;
//             }
//         },
//         onClose: () => {
//             console.log("❌ WebSocket disconnected");
//             authSentRef.current = false;
//         },
//         onError: (err) => {
//             console.error("🔥 WebSocket error", err);
//         },
//         shouldReconnect: () => {
//             console.log("🔁 Attempting to reconnect...");
//             return true;
//         },
//         reconnectAttempts: 10,
//         reconnectInterval: 3000,
//     });
//
//     useEffect(() => {
//         if (timer !== null) {
//             localStorage.setItem("soal-timer", timer.toString());
//         }
//     }, [timer]);
//
//     useEffect(() => {
//         const savedTimer = localStorage.getItem("soal-timer");
//         if (savedTimer !== null) {
//             setTimer(parseInt(savedTimer, 10));
//         }
//     }, []);
//
//
//
//
//
//     useEffect(() => {
//         if (!lastJsonMessage) return;
//
//         const message = lastJsonMessage as ServerMessage;
//
//         if ("error" in message && message.error) {
//             console.error("⚠️ Server error:", message.error);
//             setErrors((prev) => [...prev, message.error]);
//
//             switch (message.error) {
//                 case "No token provided":
//                 case "Token ws not found or expired":
//                     navigate("/exam");
//                     resetTimer();
//                     break;
//                 case "Param timer lebih dari durasi":
//                     window.location.reload();
//                     break;
//             }
//             return;
//         }
//
//         switch (message.type) {
//             case "info-ujian":
//                 setDataUjian(message.payload);
//                 if (!soalRequestedRef.current && readyState === WebSocket.OPEN) {
//                     const { sisa_timer } = message.payload;
//                     setTimer(sisa_timer);
//                     sendJsonMessage({ type: "soal" });
//                     soalRequestedRef.current = true;
//                     console.log("📨 Requesting soal for the first time...");
//                 }
//                 break;
//             case "soal-ujian":
//                 setSoal(message.payload);
//                 setSoalReady(true);
//                 break;
//             case "timer-ujian":
//                 // console.log(message.payload);
//                 break;
//             case "jawaban":
//                 console.log(message.payload);
//                 break;
//             case "reset-ujian":
//                 resetTimer();
//                 localStorage.removeItem("wsToken");
//                 break;
//             case "submit-ujian":
//                 console.log(message.payload);
//                 break;
//             default:
//                 console.warn("⚠️ Unknown message type:", message);
//                 break;
//         }
//     }, [
//         lastJsonMessage,
//         readyState,
//         sendJsonMessage,
//         navigate,
//         resetTimer,
//     ]);
//
//     const sendJawaban = useCallback(
//         (id_soal: number, jawaban: string) => {
//             if (readyState !== WebSocket.OPEN) {
//                 console.warn("⚠️ WebSocket not connected. Cannot send jawaban.");
//                 return;
//             }
//
//             if (jawabanSentRef.current[id_soal] === jawaban) {
//                 console.log("📭 Jawaban sudah dikirim, tidak mengirim ulang.");
//                 return;
//             }
//
//             sendJsonMessage({
//                 type: "jawab",
//                 id_soal_ujian: id_soal,
//                 jawaban,
//             });
//
//             jawabanSentRef.current[id_soal] = jawaban;
//             console.log(`✅ Jawaban dikirim untuk soal ${id_soal}: ${jawaban}`);
//         },
//         [readyState, sendJsonMessage]
//     );
//
//     const sendTimer = useCallback(
//         (sisa_timer: number) => {
//             if (readyState !== WebSocket.OPEN) {
//                 console.warn("⚠️ WebSocket not connected. Cannot send timer.");
//                 return;
//             }
//
//             sendJsonMessage({
//                 type: "timer",
//                 sisa: sisa_timer,
//             });
//
//             // console.log(`⏱️ Timer dikirim: ${sisa_timer} detik`);
//         },
//         [readyState, sendJsonMessage]
//     );
//
//     const submitUjian = useCallback(() => {
//         if (readyState !== WebSocket.OPEN) {
//             console.warn("⚠️ WebSocket not connected. Cannot submit ujian.");
//             return;
//         }
//
//         sendJsonMessage({
//             type: "submit",
//         });
//         localStorage.removeItem("soal-timer");
//
//         console.log("📤 Submit ujian dikirim");
//     }, [readyState, sendJsonMessage]);
//
//     useEffect(() => {
//         const interval = setInterval(() => {
//             if (timer != null) {
//                 sendTimer(timer);
//             }
//         }, 1000);
//         return () => clearInterval(interval);
//     }, [timer, sendTimer]);
//
//
//     return {
//         errors,
//         dataUjian,
//         soal,
//         soalReady,
//         setSoalReady,
//         timer,
//         setTimer,
//         sendJawaban,
//         sendTimer,
//         submitUjian,
//         sendJsonMessage,
//         lastJsonMessage,
//         readyState,
//         getWebSocket,
//     };
// };
//

import useWebSocket from "react-use-websocket";
import { useEffect, useRef, useState, useCallback } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { QuestionType } from "@/types/types";
import { useNavigate } from "react-router-dom";

type AuthMessage = { token: string; type: "auth" };

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
    const [soalReady, setSoalReady] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [timer, setTimer] = useState<number | null>(null);

    const { wsToken } = useGlobal();
    const navigate = useNavigate();

    const resetTimer = useCallback(() => {
        setTimer(null);
        localStorage.removeItem("exam_end_time");
        localStorage.removeItem("exam_duration");
    }, []);

    const {
        sendJsonMessage,
        lastJsonMessage,
        readyState,
        getWebSocket,
    } = useWebSocket(WSS_URL, {
        onOpen: () => {
            if (!authSentRef.current) {
                sendJsonMessage({ token: wsToken, type: "auth" } as AuthMessage);
                authSentRef.current = true;
            }
        },
        onClose: () => {
            authSentRef.current = false;
        },
        onError: (err) => {
            console.error("WebSocket error", err);
        },
        shouldReconnect: () => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
    });

    // Restore timer on refresh
    useEffect(() => {
        const savedEndTime = localStorage.getItem("exam_end_time");
        if (savedEndTime) {
            const remaining = Math.floor((parseInt(savedEndTime) - Date.now()) / 1000);
            setTimer(remaining > 0 ? remaining : 0);
        }
    }, []);

    // Countdown interval
    useEffect(() => {
        if (timer === null) return;

        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev !== null && prev > 0) return prev - 1;
                return 0;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    // Sync sisa_timer to server every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (timer !== null) {
                sendTimer(timer);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        if (!lastJsonMessage) return;
        const message = lastJsonMessage as ServerMessage;

        if ("error" in message && message.error) {
            setErrors(prev => [...prev, message.error]);
            switch (message.error) {
                case "No token provided":
                case "Token ws not found or expired":
                    navigate("/exam");
                    resetTimer();
                    break;
                case "Param timer lebih dari durasi":
                    window.location.reload();
                    break;
            }
            return;
        }

        switch (message.type) {
            case "info-ujian":
                setDataUjian(message.payload);
                if (!soalRequestedRef.current && readyState === WebSocket.OPEN) {
                    const { mulai, durasi_ujian } = message.payload;

                    let startTime = 0;
                    if (mulai) {
                        const today = new Date();
                        const dateStr = today.toISOString().split("T")[0];
                        const fullDateTimeStr = `${dateStr}T${mulai}`;
                        startTime = new Date(fullDateTimeStr).getTime();
                    } else {
                        startTime = Date.now();
                    }

                    const endTime = startTime + durasi_ujian * 1000;
                    const now = Date.now();
                    const remaining = Math.floor((endTime - now) / 1000);

                    localStorage.setItem("exam_end_time", endTime.toString());
                    localStorage.setItem("exam_duration", durasi_ujian.toString());

                    setTimer(remaining > 0 ? remaining : 0);

                    sendJsonMessage({ type: "soal" });
                    soalRequestedRef.current = true;
                }
                break;

            case "soal-ujian":
                setSoal(message.payload);
                setSoalReady(true);
                break;

            case "timer":
                // No need to handle here, we sync from local
                break;

            case "reset-ujian":
                resetTimer();
                localStorage.removeItem("wsToken");
                break;

            case "submit-ujian":
                resetTimer();
                break;

            case "auto-submit":
                submitUjian();
                break;

            default:
                break;
        }
    }, [lastJsonMessage, readyState, sendJsonMessage, navigate, resetTimer]);

    const sendJawaban = useCallback(
        (id_soal: number, jawaban: string) => {
            if (readyState !== WebSocket.OPEN) return;
            if (jawabanSentRef.current[id_soal] === jawaban) return;

            sendJsonMessage({
                type: "jawab",
                id_soal_ujian: id_soal,
                jawaban,
            });

            jawabanSentRef.current[id_soal] = jawaban;
        },
        [readyState, sendJsonMessage]
    );

    const sendTimer = useCallback(
        (sisa_timer: number) => {
            if (readyState === WebSocket.OPEN) {
                sendJsonMessage({
                    type: "timer",
                    sisa: sisa_timer,
                });
            }
        },
        [readyState, sendJsonMessage]
    );

    const submitUjian = useCallback(() => {
        if (readyState === WebSocket.OPEN) {
            sendJsonMessage({ type: "submit" });
        }

        localStorage.removeItem("exam_end_time");
        localStorage.removeItem("exam_duration");
    }, [readyState, sendJsonMessage]);

    return {
        errors,
        dataUjian,
        soal,
        soalReady,
        setSoalReady,
        timer,
        setTimer,
        sendJawaban,
        sendTimer,
        submitUjian,
        sendJsonMessage,
        lastJsonMessage,
        readyState,
        getWebSocket,
    };
};
