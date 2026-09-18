import { useCallback, useEffect, useMemo, useState } from "react";
import type { Game, GameStatus } from "@watchlog/shared";
import { LocalGameLog } from "../infrastructure/local-game-log";
import { useAuth } from "./auth-context";

export function useGameLog() {
  const { user } = useAuth();
  const log = useMemo(() => user ? new LocalGameLog(user.id) : null, [user]);
  const [watched, setWatched] = useState<Game[]>([]);
  const [pending, setPending] = useState<Game[]>([]);
  const [all, setAll] = useState<Game[]>([]);

  const refresh = useCallback(() => {
    if (!log) return;
    setWatched(log.watched());
    setPending(log.pending());
    setAll(log.all());
  }, [log]);

  useEffect(refresh, [refresh]);

  const statusOf = useCallback((id: number) => all.find((game) => game.id === id)?.status, [all]);
  const isWatched = useCallback((id: number) => statusOf(id) === "completed", [statusOf]);
  const isPending = useCallback((id: number) => statusOf(id) === "want", [statusOf]);

  const markWatched = useCallback((game: Game) => {
    if (!log) return;
    const next = all.some((item) => item.id === game.id)
      ? all.map((item) => item.id === game.id ? { ...item, status: "completed" as const } : item)
      : [{ ...game, status: "completed" as const }, ...all];
    log.saveAll(next);
    refresh();
  }, [all, refresh]);

  const unmarkWatched = useCallback((id: number) => {
    if (!log) return;
    log.saveAll(all.filter((game) => game.id !== id));
    refresh();
  }, [all, refresh]);

  const markPending = useCallback((game: Game) => {
    if (!log) return;
    const next = all.some((item) => item.id === game.id)
      ? all.map((item) => item.id === game.id ? { ...item, status: "want" as const } : item)
      : [{ ...game, status: "want" as const }, ...all];
    log.saveAll(next);
    refresh();
  }, [all, refresh]);

  const unmarkPending = useCallback((id: number) => {
    if (!log) return;
    log.saveAll(all.filter((game) => game.id !== id));
    refresh();
  }, [all, refresh]);

  const setStatus = useCallback((game: Game, status: GameStatus) => {
    if (!log) return;
    const next = all.some((item) => item.id === game.id)
      ? all.map((item) => item.id === game.id ? { ...item, status } : item)
      : [{ ...game, status }, ...all];
    log.saveAll(next);
    refresh();
  }, [all, refresh]);

  const updateWatchedGame = useCallback((id: number, updates: Partial<Pick<Game, "userRating" | "review">>) => {
    if (!log) return;
    log.saveAll(all.map((game) => game.id === id ? { ...game, ...updates } : game));
    refresh();
  }, [all, refresh]);

  return { watched, pending, all, statusOf, isWatched, isPending, markWatched, unmarkWatched, markPending, unmarkPending, setStatus, updateWatchedGame };
}
