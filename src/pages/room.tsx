import { ArrowLeft, LoaderCircle, Radio, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { QuestionForm } from "@/components/question-form";
import { QuestionList } from "@/components/question-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RoomParams = {
  roomId: string;
};

export function Room() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const params = useParams<RoomParams>();

  if (!params.roomId) {
    return <Navigate replace to="/" />;
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleFileChange = async (e: FileChangeEvent): Promise<void> => {
    const audioFile: File | undefined = e.target.files?.[0];
    if (!audioFile) {
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", audioFile, "audio.webm");

    const response = await fetch(
      `http://localhost:3333/rooms/${params.roomId}/audio`,
      {
        method: "POST",
        body: formData,
      }
    );
    await response.json();
    setUploading(false);
  };

  return (
    <div className="bg-zinc-950 min-h-screen">
      <div className="mx-auto px-4 py-8 max-w-4xl container">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 size-4" />
                Voltar ao Início
              </Button>
            </Link>
            <div className="flex flex-row items-center gap-3">
              <Input
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
                type="file"
              />
              <Button
                className="flex items-center gap-2"
                disabled={uploading}
                onClick={handleButtonClick}
                variant="secondary"
              >
                <Upload className="size-4" />
                Subir Áudio
                {uploading && <LoaderCircle className="animate-spin" />}
              </Button>
              <Link to={`/room/${params.roomId}/audio`}>
                <Button className="flex items-center gap-2" variant="secondary">
                  <Radio className="size-4" />
                  Gravar Áudio
                </Button>
              </Link>
            </div>
          </div>
          <h1 className="mb-2 font-bold text-foreground text-3xl">
            Sala de Perguntas
          </h1>
          <p className="text-muted-foreground">
            Faça perguntas e receba respostas com IA
          </p>
        </div>

        <div className="mb-8">
          <QuestionForm roomId={params.roomId} />
        </div>

        <QuestionList roomId={params.roomId} />
      </div>
    </div>
  );
}
