import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { QuestionType } from "@/types/types.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { sendFotoJawaban } from "@/app/api/api-cbt.ts";
import { toast } from "sonner";
import React from "react";
import HTMLWithImagePreview from "@/components/exam/questionComponent/component/SafeHTMLWithImagePreview.tsx";
import { useEffect, useRef, useState } from "react";

interface ExamQuestionsProps {
  questions: QuestionType[];
  currentQuestion: number;
  onAnswerChange: (questionId: number, answer: string, type: number) => void;
  answers: Record<number, string | null>;
  token: string;
}

export default function ExamQuestions({
  questions,
  currentQuestion,
  onAnswerChange,
  answers,
  token,
}: ExamQuestionsProps) {
  const question = questions[currentQuestion];
  const [localAnswer, setLocalAnswer] = useState<string>("");
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);

  useEffect(() => {
    // Reset local answer when question changes
    const currentAnswer =
      answers[question?.id_soal_ujian] || question?.jawaban || "";
    setLocalAnswer(currentAnswer);
  }, [currentQuestion, question, answers]);

  useEffect(() => {
    const disableActions = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("copy", disableActions);
    document.addEventListener("cut", disableActions);
    document.addEventListener("paste", disableActions);
    document.addEventListener("contextmenu", disableActions);

    return () => {
      document.removeEventListener("copy", disableActions);
      document.removeEventListener("cut", disableActions);
      document.removeEventListener("paste", disableActions);
      document.removeEventListener("contextmenu", disableActions);
    };
  }, []);

  useEffect(() => {
    const blockPrint = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        toast.error("Print tidak diizinkan selama ujian.");
      }
    };
    document.addEventListener("keydown", blockPrint);
    return () => document.removeEventListener("keydown", blockPrint);
  }, []);

  if (!question)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Soal Sedang Disiapkan...
        </h2>
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-6 w-5/6 rounded-md" />
        <Skeleton className="h-6 w-2/3 rounded-md" />
        <Skeleton className="h-48 w-[300px] rounded-xl" />
      </div>
    );

  const handleMultipleChoiceChange = (value: string, type = 1) => {
    onAnswerChange(question.id_soal_ujian, value, type);
  };

  const handleTextAnswerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type = 2
  ) => {
    const value = e.target.value;
    setLocalAnswer(value);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      onAnswerChange(question.id_soal_ujian, value, type);
    }, 1000); // 1 detik delay
  };

  const handleTextAnswerBlur = () => {
    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    // Immediately send the answer on blur
    onAnswerChange(question.id_soal_ujian, localAnswer, 2);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    soalId: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Format file harus JPG, JPEG, atau PNG.");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Ukuran file maksimal 3MB.");
      return;
    }

    try {
      setIsLoadingUpload(true);
      const response = await sendFotoJawaban({
        file,
        token,
        id_soal_ujian: soalId,
      });

      if (response.status !== "success") {
        setIsLoadingUpload(false);
      }
      toast.success("Jawaban berhasil diupload!");
      onAnswerChange(soalId, URL.createObjectURL(file), 3);
    } catch (error: any) {
      toast.error(error.message || "Gagal mengupload jawaban.");
    } finally {
      setIsLoadingUpload(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {currentQuestion + 1}
          </span>
          <h2 className="text-lg font-semibold">Question</h2>
        </div>

        <Card className="p-4 mb-4 flex-row flex">
          <HTMLWithImagePreview html={question.pertanyaan as string} />
        </Card>

        {question.tipe === "1" && (
          <div className="space-y-4">
            <RadioGroup
              value={answers[question.id_soal_ujian] ?? question.jawaban ?? ""}
              onValueChange={handleMultipleChoiceChange}
            >
              {["a", "b", "c", "d", "e"].map((option) => {
                if (!question[option as keyof QuestionType]) return null;

                const currentVal =
                  answers[question.id_soal_ujian] ?? question.jawaban ?? "";
                const isSelected = currentVal === option;

                return (
                  <Label
                    key={option}
                    htmlFor={`option-${option}`}
                    className={`flex items-start gap-3 p-4 m-2 border rounded-md cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-green-100 border-green-500"
                        : "hover:bg-muted border-border"
                    }`}
                  >
                    <RadioGroupItem
                      value={option}
                      id={`option-${option}`}
                      className="mt-0"
                    />
                    <div className="flex flex-row">
                      <HTMLWithImagePreview
                        html={question[option as keyof QuestionType] as string}
                      />
                    </div>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>
        )}

        {question.tipe === "2" && (
          <div className="space-y-4">
            <Label htmlFor="short-answer">Your Answer:</Label>
            <Input
              id="short-answer"
              value={localAnswer}
              onChange={handleTextAnswerChange}
              onBlur={handleTextAnswerBlur}
              placeholder="Type your answer here..."
              className="w-full"
            />
          </div>
        )}

        {question.tipe === "3" && (
          <div className="space-y-4">
            <Label htmlFor={`upload-answer-${question.id_soal_ujian}`}>
              Upload Jawaban (gambar maks. 3MB):
            </Label>

            <input
              type="file"
              accept="image/*"
              id={`upload-answer-${question.id_soal_ujian}`}
              onChange={(e) => handleImageUpload(e, question.id_soal_ujian)}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-white hover:file:bg-blue-600"
            />

            {(answers[question.id_soal_ujian] || question.jawaban) && (
              <div className="pt-2">
                <img
                  src={
                    answers[question.id_soal_ujian] || question.jawaban || ""
                  }
                  alt="Preview"
                  className="max-h-64 rounded border"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        Question {currentQuestion + 1} of {questions.length}
      </div>

      {isLoadingUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-4 shadow-lg">
            <svg
              className="animate-spin h-6 w-6 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Mengupload gambar...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
