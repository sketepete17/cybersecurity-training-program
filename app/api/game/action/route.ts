import { NextResponse } from "next/server";
import {
  startCountdown,
  startGame,
  submitAnswer,
  nextQuestion,
  showResults,
  resetRoom,
  leaveRoom,
} from "@/lib/game-room";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, roomId, playerId } = body;

    if (!action || !roomId || !playerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let room;

    switch (action) {
      case "start_countdown":
        room = await startCountdown(roomId, playerId);
        break;

      case "start_game":
        room = await startGame(roomId);
        break;

      case "submit_answer":
        room = await submitAnswer(roomId, playerId, body.questionIndex, body.answer);
        break;

      case "show_results":
        room = await showResults(roomId, playerId);
        break;

      case "next_question":
        room = await nextQuestion(roomId, playerId);
        break;

      case "reset":
        room = await resetRoom(roomId, playerId);
        break;

      case "leave":
        room = await leaveRoom(roomId, playerId);
        // Room might be null if it was deleted (empty)
        if (!room) {
          return NextResponse.json({ room: null, left: true });
        }
        break;

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    if (!room) {
      return NextResponse.json({ error: "Action failed" }, { status: 400 });
    }

    return NextResponse.json({ room });
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
