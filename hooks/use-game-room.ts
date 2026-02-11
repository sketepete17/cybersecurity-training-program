"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GameRoom } from "@/lib/game-room";

interface UseGameRoomOptions {
  roomId: string | null;
  playerId: string | null;
  enabled?: boolean;
}

export interface DepartedPlayer {
  id: string;
  name: string;
  timestamp: number;
}

export function useGameRoom({ roomId, playerId, enabled = true }: UseGameRoomOptions) {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [departedPlayers, setDepartedPlayers] = useState<DepartedPlayer[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const roomIdRef = useRef(roomId);
  const playerIdRef = useRef(playerId);
  const prevPlayerIdsRef = useRef<Map<string, string>>(new Map());

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
      const newRoom = data.room as GameRoom;

      // Detect departed players by comparing current vs previous player list
      if (newRoom && prevPlayerIdsRef.current.size > 0) {
        const newIds = new Set(newRoom.players.map((p) => p.id));
        prevPlayerIdsRef.current.forEach((name, id) => {
          if (!newIds.has(id) && id !== playerId) {
            setDepartedPlayers((prev) => {
              // Avoid duplicate notifications
              if (prev.some((d) => d.id === id && Date.now() - d.timestamp < 5000)) return prev;
              return [...prev, { id, name, timestamp: Date.now() }];
            });
          }
        });
      }

      // Update the previous player map
      if (newRoom) {
        const map = new Map<string, string>();
        newRoom.players.forEach((p) => map.set(p.id, p.name));
        prevPlayerIdsRef.current = map;
      }

      setRoom(newRoom);
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

  // Do NOT send leave on page refresh/unload - session is persisted
  // so the player can reconnect after refresh. Leave is only sent
  // explicitly via the "Leave Game" button.

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

  const dismissDeparted = useCallback((id: string) => {
    setDepartedPlayers((prev) => prev.filter((d) => d.id !== id));
  }, []);

  return { room, error, loading, sendAction, poll, departedPlayers, dismissDeparted };
}
