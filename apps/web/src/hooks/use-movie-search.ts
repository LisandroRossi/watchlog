import { useEffect, useState } from "react";
import type { Movie } from "@watchlog/shared";
import { movieApi } from "../infrastructure/movie-api";

export function useMovieSearch(query: string) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setMovies([]);
      setLoading(false);
      setError(null);
      return;
    }

    const handle = window.setTimeout(() => {
      setLoading(true);
      movieApi
        .search(trimmed)
        .then((page) => {
          setMovies(page.results);
          setError(null);
        })
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
    }, 350);

    return () => window.clearTimeout(handle);
  }, [query]);

  return { movies, loading, error };
}
