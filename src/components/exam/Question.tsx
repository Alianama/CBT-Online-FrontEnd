// import React, {useEffect} from "react";
// import useExamSocket from "@/hooks/useExamSocket.tsx";
// import { useParams } from "react-router-dom";
//
//
// const Question: React.FC = () => {
//   const { token } = useParams<{ token: string }>( );
//
//   const {
//     dataUjian,
//     soal,
//     historyJawaban,
//     kirimJawaban,
//     requestSoal,
//     isAuthenticated,
//     errors,
//     connectionStatus,
//   } = useExamSocket(token ?? "");
//
//   const status = ["Connecting", "Open", "Closing", "Closed"];
//
//   useEffect(() => {
//     if (isAuthenticated) {
//       requestSoal();
//     }
//     console.log(soal)
//   }, [isAuthenticated, requestSoal]);
//   console.log(soal)
//
//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold">Ujian</h1>
//       <p>Status: {status[connectionStatus]}</p>
//
//       {dataUjian && (
//         <div>
//           <h2>Info Ujian</h2>
//           <pre>{JSON.stringify(dataUjian, null, 2)}</pre>
//         </div>
//       )}
//
//       {soal && (
//         <div className="mt-4">
//           <h2>Soal:</h2>
//           <p>{soal.soal}</p>
//           <div>
//             {Object.entries(soal.pilihan).map(([key, value]) => (
//               <button
//                 key={key}
//                 onClick={() => kirimJawaban(soal.id_soal, key)}
//                 className="mr-2 bg-blue-500 text-white px-3 py-1 rounded"
//               >
//                 {key.toUpperCase()}: {value}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}
//
//       {errors.length > 0 && (
//         <div className="text-red-500 mt-4">
//           <h2>Errors:</h2>
//           <ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
//         </div>
//       )}
//     </div>
//   );
// };
//
// export default Question;

// import useExamSocket from "@/hooks/useExamSocket";
// import {useEffect, useRef} from "react";
//
// export default function HalamanUjian({ token }: { token: string }) {
//   const {
//     dataUjian,
//     soal,
//     historyJawaban,
//     kirimJawaban,
//     requestSoal,
//     isAuthenticated,
//     connectionStatus,
//     errors,
//   } = useExamSocket(token);
//
//   const hasRequestedSoal = useRef(false);
//
//   useEffect(() => {
//     if (isAuthenticated && !hasRequestedSoal.current) {
//       requestSoal();
//       hasRequestedSoal.current = true;
//     }
//   }, [isAuthenticated, requestSoal]);
//
//   return (
//       <div>
//         <h1>Halaman Ujian</h1>
//         <p>Status koneksi: {connectionStatus}</p>
//         {soal && (
//             <div>
//               <h2>Soal: {soal.soal}</h2>
//               {Object.entries(soal.pilihan).map(([key, val]) => (
//                   <button key={key} onClick={() => kirimJawaban(soal.id_soal, key)}>
//                     {key}. {val}
//                   </button>
//               ))}
//             </div>
//         )}
//       </div>
//   );
// }


// components/ExamSocketViewer.tsx
import React, { useState } from 'react';
import { useExamSocket } from '@/hooks/useExamSocket';
import {useParams} from "react-router-dom";

type MessageData = {
    [key: string]: any;
};

const ExamSocketViewer = () => {
    const { token } = useParams<{ token: string }>( );
    const { lastJsonMessage,soal, sendJsonMessage, readyState } = useExamSocket(token ?? "");
    const [messages, setMessages] = useState<MessageData[]>([]);

    // simpan setiap pesan baru ke array
    React.useEffect(() => {
        if (lastJsonMessage) {
            console.log(soal)
            setMessages((prev) => [...prev, lastJsonMessage]);
        }
    }, [soal,lastJsonMessage]);

    const statusList = ['Connecting', 'Open', 'Closing', 'Closed'];

    return (
        <div className="p-4 border rounded max-w-2xl mx-auto bg-white shadow">
            <h2 className="text-xl font-bold mb-4">🧠 Exam Socket Viewer</h2>
            <p className="mb-2 text-sm text-gray-600">
                Status: <strong>{statusList[readyState]}</strong>
            </p>

            <div className="h-64 overflow-y-auto bg-gray-100 p-2 mb-4 rounded text-sm">
                {messages.length === 0 && <p className="text-gray-500">Belum ada data masuk.</p>}
                {messages.map((msg, idx) => (
                    <pre key={idx} className="mb-2 bg-white p-2 rounded border">
            {JSON.stringify(msg, null, 2)}
          </pre>
                ))}
            </div>

            <button
                onClick={() => sendJsonMessage({ type: "soal" })}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
                Kirim Ping
            </button>
        </div>
    );
};

export default ExamSocketViewer;
