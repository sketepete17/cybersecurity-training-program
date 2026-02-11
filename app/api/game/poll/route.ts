import { NextResponse } from "next/server";
import { heartbeat } from "@/lib/game-room";

export async function POST(req: Request) {
  try {
    const { roomId, playerId } = await req.json();

    if (!roomId || !playerId) {
      return NextResponse.json({ error: "Missing roomId or playerId" }, { status: 400 });
    }

    const room = await heartbeat(roomId, playerId);

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Strip answers during active play so players can't cheat
    const safeRoom = { ...room };
    if (room.status === "playing") {
      safeRoom.questionSet = room.questionSet.map((q, i) => {
        if (i >= room.currentQuestion) {
          const stripped = { ...q, explanation: "", funFact: "", clues: [] };
          if (q.type === "phish") return { ...stripped, isPhishing: undefined as unknown as boolean };
          if (q.type === "password") return { ...stripped, correctAnswer: -1 };
          if (q.type === "spot_url") return { ...stripped, correctIndex: -1 };
          return stripped;
        }
        return q;
      });
    }

    return NextResponse.json({ room: safeRoom });
  } catch {
    return NextResponse.json({ error: "Failed to poll" }, { status: 500 });
  }
}
