import useWebSocket from "react-use-websocket";
import { useEffect, useRef, useState, useCallback } from "react";
import { useGlobal } from "@/context/GlobalContext";
import { QuestionType } from "@/types/types";
import { useNavigate } from "react-router-dom";

type AuthMessage = { token: string; type: "auth" };

type InfoUjianPayload = {
  id_peserta: number;
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

const MAPPING_KEY = "mapping_jawaban";
const WSS_URL = import.meta.env.VITE_WSS_URL;

export const useExamSocket = () => {
  const authSentRef = useRef(false);
  const soalRequestedRef = useRef(false);
  const jawabanSentRef = useRef<Record<number, string>>({});
  const [dataUjian, setDataUjian] = useState<InfoUjianPayload>();
  const [soal, setSoal] = useState<QuestionType[]>([]);
  const [soalReady, setSoalReady] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [timer, setTimer] = useState<number>(3000);
  const [mapingJawaban, setMapingJawaban] = useState<Record<string, string>>(
    {}
  );
  const { wsToken, setWsToken } = useGlobal();
  const navigate = useNavigate();

  const resetTimer = useCallback(() => {
    setTimer(0);
    localStorage.removeItem("exam_end_time");
    localStorage.removeItem("exam_duration");
    localStorage.removeItem("id_peserta");
    localStorage.removeItem(MAPPING_KEY);
  }, []);

  const { sendJsonMessage, lastJsonMessage, readyState, getWebSocket } =
    useWebSocket(WSS_URL, {
      onOpen: () => {
        // console.log("WebSocket Connected, sending auth...");
        if (!authSentRef.current) {
          sendJsonMessage({ token: wsToken, type: "auth" } as AuthMessage);
          authSentRef.current = true;
        }
      },
      onClose: () => {
        // console.log("WebSocket Disconnected");
        authSentRef.current = false;
        resetTimer();
      },
      onError: (err) => {
        // console.error("WebSocket error", err);
        resetTimer();
        setWsToken("");
        navigate("/exam");
      },
      shouldReconnect: () => true,
      reconnectAttempts: 10,
      reconnectInterval: 3000,
    });

  useEffect(() => {
    const savedEndTime = localStorage.getItem("exam_end_time");
    const savedMapping = localStorage.getItem(MAPPING_KEY);

    if (savedEndTime) {
      const remaining = Math.floor(
        (parseInt(savedEndTime) - Date.now()) / 1000
      );
      setTimer(remaining > 0 ? remaining : 0);
    }

    if (savedMapping) {
      try {
        const parsed = JSON.parse(savedMapping);
        if (typeof parsed === "object") {
          setMapingJawaban(parsed);
        }
      } catch (e) {
        // console.error("Invalid saved mapping_jawaban");
      }
    }
  }, []);

  // const timerRef = useRef(timer);
  // timerRef.current = timer;
  //
  // useEffect(() => {
  //     const interval = setInterval(() => {
  //         sendTimer(timerRef.current);
  //     }, 100);
  //
  //     return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    sendTimer(timer);
  }, [timer]);

  useEffect(() => {
    if (!lastJsonMessage) return;
    const message = lastJsonMessage as ServerMessage;

    if ("error" in message && message.error) {
      setErrors((prev) => [...prev, message.error]);

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
        // console.log("Received info-ujian");
        setDataUjian(message.payload);
        localStorage.setItem("id_peserta", message.payload.id_peserta);
        setTimer(message.payload.sisa_timer);

        if (message.payload.mapping_jawaban) {
          setMapingJawaban(message.payload.mapping_jawaban);
          localStorage.setItem(
            MAPPING_KEY,
            JSON.stringify(message.payload.mapping_jawaban)
          );
        }

        if (!soalRequestedRef.current && readyState === WebSocket.OPEN) {
          // console.log("Requesting soal...");
          sendJsonMessage({ type: "soal" });
          soalRequestedRef.current = true;
        }
        break;
      case "soal-ujian":
        setSoal(message.payload);
        setSoalReady(true);
        break;
      case "reset-ujian":
        setSoal([]);
        resetTimer();
        navigate("/exam");
        break;
      case "submit-ujian":
        resetTimer();
        localStorage.removeItem("wsToken");
        break;

      case "auto-submit":
        submitUjian();
        break;
      default:
        break;
    }
  }, [lastJsonMessage, readyState, sendJsonMessage, navigate, resetTimer]);

  const sendJawaban = useCallback(
    (id_soal: number, jawaban: string, type: number) => {
      if (readyState !== WebSocket.OPEN) return;

      if (type === 2) {
        if (jawabanSentRef.current[id_soal] === jawaban) return;

        sendJsonMessage({
          type: "jawab",
          id_soal_ujian: id_soal,
          jawaban: jawaban,
        });

        jawabanSentRef.current[id_soal] = jawaban;
        return;
      }

      const mappedJawaban = mapingJawaban[jawaban];

      if (!mappedJawaban) {
        // console.warn("Jawaban tidak ditemukan dalam mapping", jawaban);
        return;
      }

      if (jawabanSentRef.current[id_soal] === mappedJawaban) return;

      sendJsonMessage({
        type: "jawab",
        id_soal_ujian: id_soal,
        jawaban: mappedJawaban,
      });

      jawabanSentRef.current[id_soal] = mappedJawaban;
    },
    [readyState, sendJsonMessage, mapingJawaban]
  );

  const sendTimer = (sisa_timer: number | null) => {
    if (readyState === WebSocket.OPEN) {
      sendJsonMessage({
        type: "timer",
        sisa: sisa_timer,
      });
    }
  };

  const submitUjian = useCallback(() => {
    if (readyState === WebSocket.OPEN) {
      sendJsonMessage({ type: "submit" });
    }

    resetTimer();
  }, [readyState, sendJsonMessage, resetTimer]);

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
