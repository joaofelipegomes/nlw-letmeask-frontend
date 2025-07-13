import { ArrowLeft, Radio } from "lucide-react";
import { useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

type RoomParams = {
  roomId: string;
};

const isRecordingSupported =
  !!navigator.mediaDevices &&
  typeof navigator.mediaDevices.getUserMedia === "function" &&
  typeof window.MediaRecorder === "function";

export function RecordRoomAudio() {
  const params = useParams<RoomParams>();
  const [isRecording, setIsRecording] = useState(false);
  const recorder = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>(null);

  function stopRecording() {
    setIsRecording(false);

    if (recorder.current && recorder.current.state !== "inactive") {
      recorder.current.stop();
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }

  async function uploadAudio(audio: Blob) {
    const formData = new FormData();

    formData.append("file", audio, "audio.webm");
    const response = await fetch(
      `http://localhost:3333/rooms/${params.roomId}/audio`,
      {
        method: "POST",
        body: formData,
      }
    );
    await response.json();
  }

  function createRecorder(audio: MediaStream) {
    recorder.current = new MediaRecorder(audio, {
      mimeType: "audio/webm",
      audioBitsPerSecond: 64_000,
    });

    recorder.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        uploadAudio(event.data);
      }
    };

    recorder.current.onstart = () => {
      console.log("Gravação iniciada");
    };

    recorder.current.onstop = () => {
      console.log("Gravação parada");
    };

    recorder.current.start();
  }

  async function startRecording() {
    if (!isRecordingSupported) {
      alert("Gravação de áudio não é suportada neste navegador.");
      return;
    }

    setIsRecording(true);

    const audio = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44_100,
      },
    });

    createRecorder(audio);

    intervalRef.current = setInterval(() => {
      recorder.current?.stop();

      createRecorder(audio);
    }, 5000);
  }

  if (!params.roomId) {
    return <Navigate replace to="/" />;
  }

  return (
    <div className="flex flex-col justify-center items-start h-screen">
      <div className="mx-auto px-4 py-8 max-w-4xl h-full container">
        <div className="">
          <div className="flex justify-between items-center">
            <Link to={`/room/${params.roomId}/`}>
              <Button variant="outline">
                <ArrowLeft className="mr-2 size-4" />
                Voltar ao Início
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex justify-center items-center w-full h-full">
          {isRecording ? (
            <Button className="flex flex-row gap-2" onClick={stopRecording}>
              Parar gravação{" "}
              <div className="flex justify-between w-5 h-5">
                <div className="w-2 h-full">
                  <div className="bg-black rounded w-1 h-full animate-shrink" />
                </div>
                <div className="w-2 h-full">
                  <div className="bg-black rounded w-1 h-full animate-grow" />
                </div>
                <div className="w-2 h-full">
                  <div className="bg-black rounded w-1 h-full animate-shrink" />
                </div>
              </div>
            </Button>
          ) : (
            <Button onClick={startRecording}>Iniciar gravação</Button>
          )}
        </div>
      </div>
    </div>
  );
}
