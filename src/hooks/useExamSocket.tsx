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
    const [timer, setTimer] = useState<number>(3000);
    const [mapingJawaban, setMapingJawaban] = useState([]);
    const { wsToken } = useGlobal();
    const navigate = useNavigate();


    const resetTimer = useCallback(() => {
        setTimer(0);
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


    useEffect(() => {
        const savedEndTime = localStorage.getItem("exam_end_time");
        if (savedEndTime) {
            const remaining = Math.floor((parseInt(savedEndTime) - Date.now()) / 1000);
            setTimer(remaining > 0 ? remaining : 0);
        }
    }, []);

    useEffect(() => {
        sendTimer(timer);
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
                setTimer(message.payload.sisa_timer);
                setMapingJawaban(message.payload.mapping_jawaban);
                if (!soalRequestedRef.current && readyState === WebSocket.OPEN) {
                    sendJsonMessage({ type: "soal" });
                    soalRequestedRef.current = true;
                }
                break;

            case "soal-ujian":
                setSoal(message.payload);
                setSoalReady(true);
                break;

            case "timer-ujian":
              console.log(message.payload)
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
            case "jawaban":
                break;
            default:
                console.log(message);
                break;
        }
    }, [lastJsonMessage, readyState, sendJsonMessage, navigate, resetTimer]);

    const sendJawaban = useCallback(
      (id_soal: number, jawaban: string) => {
          if (readyState !== WebSocket.OPEN) return;

          const mappedJawaban = mapingJawaban[jawaban as keyof typeof mapingJawaban] || jawaban;

          if (jawabanSentRef.current[id_soal] === mappedJawaban) return;

          sendJsonMessage({
              type: "jawab",
              id_soal_ujian: id_soal,
              jawaban: mappedJawaban,
          });


          if (typeof mappedJawaban === "string") {
              jawabanSentRef.current[id_soal] = mappedJawaban;
          }
      },
      [readyState, sendJsonMessage]
    );

    const sendTimer = (sisa_timer: number | null) => {
            if (readyState === WebSocket.OPEN) {
                sendJsonMessage({
                    type: "timer",
                    sisa: sisa_timer,
                });
            }
        }

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
