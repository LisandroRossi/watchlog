import { useEffect, useState } from "react";
import type { Movie } from "@watchlog/shared";
import { movieApi } from "../infrastructure/movie-api";

export function usePopularMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    movieApi
      .popular()
      .then((page) => {
        if (!cancelled) {
          setMovies(page.results);
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
  }, []);

  return { movies, loading, error };
}
