import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuestionType } from "@/types/types.ts";

interface QuestionNavigationProps {
  questions: QuestionType[];
  currentQuestion: number;
  setCurrentQuestion: (index: number) => void;
  answers: Record<number, string | null>;
  isMobile: boolean;
}

export default function QuestionNavigation({
  questions,
  currentQuestion,
  setCurrentQuestion,
  answers,
  isMobile,
}: QuestionNavigationProps) {
  const [isOpen, setIsOpen] = useState(!isMobile);

  const getQuestionStatus = (questionId: number) => {
    // Cek jawaban dari state answers dan jawaban dari soal
    const currentAnswer = answers[questionId];
    const questionAnswer = questions.find(
      (q) => q.id_soal_ujian === questionId
    )?.jawaban;

    if (currentAnswer !== null || questionAnswer) return "answered";
    return "unanswered";
  };

  const getButtonClass = (index: number, status: string) => {
    return cn(
      "w-8 h-8 rounded-full font-medium text-sm flex items-center justify-center",
      {
        "bg-primary text-primary-foreground": index === currentQuestion,
        "bg-muted text-muted-foreground hover:bg-muted/80":
          status === "unanswered" && index !== currentQuestion,
        "bg-green-500 text-white hover:bg-green-600":
          status === "answered" && index !== currentQuestion,
        "ring-2 ring-primary": index === currentQuestion,
      }
    );
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex justify-between items-center m-10 mb-2">
        {isMobile && (
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="p-0 h-8">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="ml-2">
                {isOpen ? "Sembunyikan" : "Tampilkan"}
              </span>
            </Button>
          </CollapsibleTrigger>
        )}
      </div>

      <CollapsibleContent>
        <ScrollArea className={isMobile ? "h-24" : "h-[calc(100vh-200px)]"}>
          <div
            className={`m-4 grid ${isMobile ? "grid-cols-10" : "grid-cols-5"} gap-2`}
          >
            {questions.map((question, index) => (
              <Button
                key={question.id_soal_ujian}
                className={getButtonClass(
                  index,
                  getQuestionStatus(question.id_soal_ujian)
                )}
                onClick={() => setCurrentQuestion(index)}
                variant="ghost"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
}
