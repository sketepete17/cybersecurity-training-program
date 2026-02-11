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
  const roomIdRef = useRef(roomId);
  const playerIdRef = useRef(playerId);

  // Keep refs in sync for the beforeunload handler
  useEffect(() => { roomIdRef.current = roomId; }, [roomId]);
  useEffect(() => { playerIdRef.current = playerId; }, [playerId]);

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

  // Send leave on tab close / page unload
  useEffect(() => {
    if (!enabled || !roomId || !playerId) return;

    const handleUnload = () => {
      const rid = roomIdRef.current;
      const pid = playerIdRef.current;
      if (!rid || !pid) return;

      // Use sendBeacon with Blob for reliable delivery with correct content type
      const payload = JSON.stringify({ action: "leave", roomId: rid, playerId: pid });
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/game/action", blob);
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [enabled, roomId, playerId]);

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
