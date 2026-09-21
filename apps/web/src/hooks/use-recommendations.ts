import { useEffect, useState } from "react";
import type { Game, Movie } from "@watchlog/shared";
import { recommendationApi } from "../infrastructure/recommendation-api";

type RecommendationResult<T> = {
  items: T[];
  preferredGenres: string[];
  loading: boolean;
  error: string | null;
};

export function useMovieRecommendations(genres: string[]): RecommendationResult<Movie> {
  const [result, setResult] = useState<RecommendationResult<Movie>>({ items: [], preferredGenres: [], loading: false, error: null });
  const key = JSON.stringify([...new Set(genres)].sort());

  useEffect(() => {
    const currentGenres = JSON.parse(key) as string[];
    if (!currentGenres.length) {
      setResult({ items: [], preferredGenres: [], loading: false, error: null });
      return;
    }
    let active = true;
    setResult((current) => ({ ...current, loading: true, error: null }));
    recommendationApi.movies(currentGenres)
      .then((page) => { if (active) setResult({ items: page.results, preferredGenres: page.preferredGenres, loading: false, error: null }); })
      .catch((error: Error) => { if (active) setResult({ items: [], preferredGenres: [], loading: false, error: error.message }); });
    return () => { active = false; };
  }, [key]);

  return result;
}

export function useGameRecommendations(genres: string[]): RecommendationResult<Game> {
  const [result, setResult] = useState<RecommendationResult<Game>>({ items: [], preferredGenres: [], loading: false, error: null });
  const key = JSON.stringify([...new Set(genres)].sort());

  useEffect(() => {
    const currentGenres = JSON.parse(key) as string[];
    if (!currentGenres.length) {
      setResult({ items: [], preferredGenres: [], loading: false, error: null });
      return;
    }
    let active = true;
    setResult((current) => ({ ...current, loading: true, error: null }));
    recommendationApi.games(currentGenres)
      .then((page) => { if (active) setResult({ items: page.results, preferredGenres: page.preferredGenres, loading: false, error: null }); })
      .catch((error: Error) => { if (active) setResult({ items: [], preferredGenres: [], loading: false, error: error.message }); });
    return () => { active = false; };
  }, [key]);

  return result;
}
