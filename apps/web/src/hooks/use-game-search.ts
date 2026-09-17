import { useEffect, useState } from "react";
import type { Game } from "@watchlog/shared";
import { gameApi } from "../infrastructure/game-api";

export function useGameSearch(query: string) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setGames([]);
      setLoading(false);
      setError(null);
      return;
    }
    const handle = window.setTimeout(() => {
      setLoading(true);
      gameApi.search(trimmed)
        .then((page) => { setGames(page.results); setError(null); })
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
    }, 350);
    return () => window.clearTimeout(handle);
  }, [query]);

  return { games, loading, error };
}
