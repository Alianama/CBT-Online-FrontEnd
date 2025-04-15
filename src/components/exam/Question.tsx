import React, {useEffect} from "react";
import useExamSocket from "@/hooks/useExamSocket.tsx";
import { useParams } from "react-router-dom";


const Question: React.FC = () => {
  const { token } = useParams<{ token: string }>( );

  const {
    dataUjian,
    soal,
    // historyJawaban,
    isAuthenticated,
    requestSoal,
    kirimJawaban,
    errors,
    connectionStatus,
  } = useExamSocket(token ?? "");

  const status = ["Connecting", "Open", "Closing", "Closed"];

  useEffect(() => {
    if (isAuthenticated && !soal) {
      requestSoal();
    }
    console.log(soal)
  }, [isAuthenticated, soal, requestSoal]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Ujian</h1>
      <p>Status: {status[connectionStatus]}</p>

      {dataUjian && (
        <div>
          <h2>Info Ujian</h2>
          <pre>{JSON.stringify(dataUjian, null, 2)}</pre>
        </div>
      )}

      {soal && (
        <div className="mt-4">
          <h2>Soal:</h2>
          <p>{soal.soal}</p>
          <div>
            {Object.entries(soal.pilihan).map(([key, value]) => (
              <button
                key={key}
                onClick={() => kirimJawaban(soal.id_soal, key)}
                className="mr-2 bg-blue-500 text-white px-3 py-1 rounded"
              >
                {key.toUpperCase()}: {value}
              </button>
            ))}
          </div>
        </div>
      )}

      {errors.length > 0 && (
        <div className="text-red-500 mt-4">
          <h2>Errors:</h2>
          <ul>{errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>
      )}
    </div>
  );
};

export default Question;
