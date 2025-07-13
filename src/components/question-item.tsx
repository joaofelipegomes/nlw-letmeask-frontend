import { Bot, Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { dayjs } from "@/lib/dayjs";

interface Question {
  id: string;
  question: string;
  answer?: string | null;
  createdAt: string;
  isGeneratingAnswer?: boolean;
}

interface QuestionItemProps {
  question: Question;
}

export function QuestionItem({ question }: QuestionItemProps) {
  return (
    <Card>
      <CardContent>
        <div className="space-y-4">
          {/* Question */}
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="flex justify-center items-center bg-primary/10 rounded-full size-8">
                <MessageSquare className="size-4 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <p className="mb-1 font-medium text-foreground">Pergunta</p>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {question.question}
              </p>
            </div>
          </div>

          {(!!question.answer || question.isGeneratingAnswer) && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex justify-center items-center bg-primary/10 rounded-full size-8">
                  <Bot className="size-4 text-secondary-foreground" />
                </div>
              </div>
              <div className="flex-1">
                <p className="mb-1 font-medium text-foreground">
                  Resposta da IA
                </p>
                <div className="text-muted-foreground">
                  {question.isGeneratingAnswer ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="size-4 text-primary animate-spin" />
                      <span className="text-primary text-sm italic">
                        Gerando resposta...
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-line">
                      {question.answer}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <span className="text-muted-foreground text-xs">
              {dayjs(question.createdAt).toNow()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
