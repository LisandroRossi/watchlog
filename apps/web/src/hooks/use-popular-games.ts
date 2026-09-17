import { useEffect, useState } from "react";
import type { Game } from "@watchlog/shared";
import { gameApi } from "../infrastructure/game-api";

export function usePopularGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    gameApi.popular()
      .then((page) => setGames(page.results))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { games, loading, error };
}
