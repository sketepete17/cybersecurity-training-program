"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GameRoom } from "@/lib/game-room";

interface UseGameRoomOptions {
  roomId: string | null;
  playerId: string | null;
  enabled?: boolean;
}

export function useGameRoom({ roomId, playerId, enabled = true }: UseGameRoomOptions) {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const poll = useCallback(async () => {
    if (!roomId || !playerId) return;
    try {
      const res = await fetch("/api/game/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, playerId }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Room not found");
        return;
      }
      const data = await res.json();
      setRoom(data.room);
      setError(null);
    } catch {
      setError("Connection lost");
    }
  }, [roomId, playerId]);

  useEffect(() => {
    if (!enabled || !roomId || !playerId) return;

    // Immediate first poll
    poll();

    // Poll every 1 second for real-time feel
    intervalRef.current = setInterval(poll, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, roomId, playerId, poll]);

  const sendAction = useCallback(
    async (action: string, extra?: Record<string, unknown>) => {
      if (!roomId || !playerId) return null;
      setLoading(true);
      try {
        const res = await fetch("/api/game/action", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, roomId, playerId, ...extra }),
        });
        const data = await res.json();
        if (data.room) {
          setRoom(data.room);
        }
        setLoading(false);
        return data;
      } catch {
        setLoading(false);
        return null;
      }
    },
    [roomId, playerId]
  );

  return { room, error, loading, sendAction, poll };
}
