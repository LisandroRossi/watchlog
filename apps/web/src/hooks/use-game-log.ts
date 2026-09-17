import { useCallback, useEffect, useState } from "react";
import type { Game, GameStatus } from "@watchlog/shared";
import { LocalGameLog } from "../infrastructure/local-game-log";

const log = new LocalGameLog();

export function useGameLog() {
  const [watched, setWatched] = useState<Game[]>([]);
  const [pending, setPending] = useState<Game[]>([]);
  const [all, setAll] = useState<Game[]>([]);

  const refresh = useCallback(() => {
    setWatched(log.watched());
    setPending(log.pending());
    setAll(log.all());
  }, []);

  useEffect(refresh, [refresh]);

  const statusOf = useCallback((id: number) => all.find((game) => game.id === id)?.status, [all]);
  const isWatched = useCallback((id: number) => statusOf(id) === "completed", [statusOf]);
  const isPending = useCallback((id: number) => statusOf(id) === "want", [statusOf]);

  const markWatched = useCallback((game: Game) => {
    const next = all.some((item) => item.id === game.id)
      ? all.map((item) => item.id === game.id ? { ...item, status: "completed" as const } : item)
      : [{ ...game, status: "completed" as const }, ...all];
    log.saveAll(next);
    refresh();
  }, [all, refresh]);

  const unmarkWatched = useCallback((id: number) => {
    log.saveAll(all.filter((game) => game.id !== id));
    refresh();
  }, [all, refresh]);

  const markPending = useCallback((game: Game) => {
    const next = all.some((item) => item.id === game.id)
      ? all.map((item) => item.id === game.id ? { ...item, status: "want" as const } : item)
      : [{ ...game, status: "want" as const }, ...all];
    log.saveAll(next);
    refresh();
  }, [all, refresh]);

  const unmarkPending = useCallback((id: number) => {
    log.saveAll(all.filter((game) => game.id !== id));
    refresh();
  }, [all, refresh]);

  const setStatus = useCallback((game: Game, status: GameStatus) => {
    const next = all.some((item) => item.id === game.id)
      ? all.map((item) => item.id === game.id ? { ...item, status } : item)
      : [{ ...game, status }, ...all];
    log.saveAll(next);
    refresh();
  }, [all, refresh]);

  const updateWatchedGame = useCallback((id: number, updates: Partial<Pick<Game, "userRating" | "review">>) => {
    log.saveAll(all.map((game) => game.id === id ? { ...game, ...updates } : game));
    refresh();
  }, [all, refresh]);

  return { watched, pending, all, statusOf, isWatched, isPending, markWatched, unmarkWatched, markPending, unmarkPending, setStatus, updateWatchedGame };
}
