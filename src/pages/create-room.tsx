import { CreateRoomForm } from "@/components/create-room-form";
import { RoomList } from "@/components/room-list";

export function CreateRoom() {
  return (
    <div className="px-4 py-8 min-h-screen">
      <div className="mx-auto max-w-4xl">
        <div className="items-start gap-8 grid grid-cols-2">
          <CreateRoomForm />
          <RoomList />
        </div>
      </div>
    </div>
  );
}
