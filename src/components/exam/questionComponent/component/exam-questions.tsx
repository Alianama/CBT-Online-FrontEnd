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
    onAnswerChange(question.id_soal_ujian, e.target.value, type);
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
      await sendFotoJawaban({
        file,
        token,
        id_soal_ujian: soalId,
      });

      toast.success("Jawaban berhasil diupload!");
      onAnswerChange(soalId, URL.createObjectURL(file), 3);
    } catch (error: any) {
      toast.error(error.message || "Gagal mengupload jawaban.");
    }
  };
  console.log(question);

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">
            {currentQuestion + 1}
          </span>
          <h2 className="text-lg font-semibold">Question</h2>
        </div>

        <Card className="p-4 mb-4">
            <HTMLWithImagePreview html={question.pertanyaan} />
        </Card>

        {question.tipe === "1" && (
          <div className="space-y-4">
            <RadioGroup
              value={answers[question.id_soal_ujian] || question.jawaban || ""}
              onValueChange={handleMultipleChoiceChange}
            >
              {["a", "b", "c", "d", "e"].map((option) => {
                if (!question[option as keyof QuestionType]) return null;
                return (
                  <div
                    key={option}
                    className="flex items-center space-x-2 m-2 rounded-md hover:bg-muted"
                  >
                    <RadioGroupItem
                      value={option}
                      id={`option-${option}`}
                      className="m-0"
                    />
                    <h1 className="mt-0">{option}</h1>
                    <Label
                      htmlFor={`option-${option}`}
                      className="flex-1 cursor-pointer"
                    >
                        <HTMLWithImagePreview html={question[option as keyof QuestionType] as string} />
                    </Label>
                  </div>
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
              value={answers[question.id_soal_ujian] || question.jawaban || ""}
              onChange={handleTextAnswerChange}
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
            {answers[question.id_soal_ujian] && (
              <div className="pt-2">
                <img
                  src={answers[question.id_soal_ujian] || ""}
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
    </div>
  );
}
