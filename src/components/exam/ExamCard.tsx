import { useExamSocket } from '@/hooks/useExamSocket';
import QuestionPage from "@/components/exam/QuestionPage";
import { Question } from "@/types/types";

const ExamSocketViewer = () => {
  const { soal, readyState, dataUjian, sendJsonMessage } = useExamSocket();
  const statusList = ['Connecting', 'Online', 'Closing', 'Offline'];

  if (!soal) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded mx-auto bg-white shadow">
      <h2 className="text-xl font-bold mb-4">{dataUjian?.nama_bank}</h2>
      <p className="mb-2 text-sm text-gray-600">
        Status: <strong>{statusList[readyState]}</strong>
      </p>
      <QuestionPage jawab={sendJsonMessage} questions={soal as unknown as Question[]} />
    </div>
  );
};

export default ExamSocketViewer;
