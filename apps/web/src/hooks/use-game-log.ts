import { useCallback, useEffect, useState } from "react";
import type { Game, GameStatus } from "@watchlog/shared";
import { libraryApi } from "../infrastructure/library-api";
import { LocalGameLog } from "../infrastructure/local-game-log";
import { useAuth } from "./auth-context";

type LoggedGame = Game & { status: GameStatus };

export function useGameLog() {
  const { user } = useAuth();
  const [all, setAll] = useState<LoggedGame[]>([]);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      let remote = (await libraryApi.list<LoggedGame>("game")).items;
      const local = new LocalGameLog(user.id);
      const migrated = local.all().map((game) => ({ ...game, status: game.status ?? "want" }));
      const missing = migrated.filter((game) => !remote.some((item) => item.id === game.id));
      if (missing.length) {
        await Promise.all(missing.map((game) => libraryApi.save("game", game.id, game.status, game)));
        remote = [...remote, ...missing];
      }
      if (migrated.length) {
        localStorage.removeItem(`watchlog.${user.id}.games`);
      }
      setAll(remote);
    } catch {
      const local = new LocalGameLog(user.id);
      setAll(local.all().map((game) => ({ ...game, status: game.status ?? "want" })));
    }
  }, [user]);

  useEffect(() => { void refresh(); }, [refresh]);

  const setStatus = useCallback(async (game: Game, status: GameStatus) => {
    const next = { ...game, status };
    setAll((items) => [next, ...items.filter((item) => item.id !== game.id)]);
    await libraryApi.save("game", game.id, status, next);
  }, []);

  const remove = useCallback(async (id: number) => {
    setAll((items) => items.filter((item) => item.id !== id));
    await libraryApi.remove("game", id);
  }, []);

  const statusOf = useCallback((id: number) => all.find((game) => game.id === id)?.status, [all]);
  const watched = all.filter((game) => game.status === "completed");
  const pending = all.filter((game) => game.status === "want");
  const isWatched = useCallback((id: number) => statusOf(id) === "completed", [statusOf]);
  const isPending = useCallback((id: number) => statusOf(id) === "want", [statusOf]);
  const updateWatchedGame = useCallback(async (id: number, updates: Partial<Pick<Game, "userRating" | "review">>) => {
    const current = all.find((game) => game.id === id);
    if (current) await setStatus({ ...current, ...updates }, "completed");
  }, [all, setStatus]);

  return { watched, pending, all, statusOf, isWatched, isPending, markWatched: (game: Game) => void setStatus(game, "completed"), unmarkWatched: (id: number) => void remove(id), markPending: (game: Game) => void setStatus(game, "want"), unmarkPending: (id: number) => void remove(id), remove, setStatus, updateWatchedGame };
}
