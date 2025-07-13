import { useRoomQuestions } from "@/http/use-room-questions";
import { QuestionItem } from "./question-item";

interface QuestionListProps {
  roomId: string;
}

export function QuestionList(props: QuestionListProps) {
  const { data } = useRoomQuestions(props.roomId);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-foreground text-2xl">
          Perguntas & Respostas
        </h2>
      </div>

      {data?.map((question) => {
        return <QuestionItem key={question.id} question={question} />;
      })}
    </div>
  );
}
