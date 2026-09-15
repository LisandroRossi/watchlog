import { useEffect, useState } from "react";
import type { Movie } from "@watchlog/shared";
import { movieApi } from "../infrastructure/movie-api";

export function useMovieDetails(id: number | undefined) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Película inválida.");
      return;
    }

    let cancelled = false;
    setLoading(true);
    movieApi
      .details(id)
      .then((result) => {
        if (!cancelled) {
          setMovie(result);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { movie, loading, error };
}
