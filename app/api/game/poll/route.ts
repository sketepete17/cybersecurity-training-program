import { NextResponse } from "next/server";
import { getRoom, heartbeat } from "@/lib/game-room";

export async function POST(req: Request) {
  try {
    const { roomId, playerId } = await req.json();

    if (!roomId || !playerId) {
      return NextResponse.json({ error: "Missing roomId or playerId" }, { status: 400 });
    }

    // Heartbeat to keep player connected
    const room = await heartbeat(roomId, playerId);

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Strip question answers for non-results states so players can't cheat
    const safeRoom = { ...room };
    if (room.status === "playing") {
      safeRoom.questionSet = room.questionSet.map((q, i) => {
        if (i === room.currentQuestion) {
          return { ...q, isPhishing: undefined as unknown as boolean, explanation: "", clues: [] };
        }
        return q;
      });
    }

    return NextResponse.json({ room: safeRoom });
  } catch {
    return NextResponse.json({ error: "Failed to poll" }, { status: 500 });
  }
}
