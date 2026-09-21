import { useCallback, useEffect, useState } from "react";
import type { Movie } from "@watchlog/shared";
import { libraryApi } from "../infrastructure/library-api";
import { LocalWatchLog } from "../infrastructure/local-watch-log";
import { movieApi } from "../infrastructure/movie-api";
import { useAuth } from "./auth-context";

type LoggedMovie = Movie & { status: "watched" | "pending" | "watching" };

export function useWatchLog() {
  const { user } = useAuth();
  const [all, setAll] = useState<LoggedMovie[]>([]);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      let remote = (await libraryApi.list<LoggedMovie>("movie")).items;
      const local = new LocalWatchLog(user.id);
      const migrated = [
        ...local.list().map((movie) => ({ ...movie, status: "watched" as const })),
        ...local.listPending().map((movie) => ({ ...movie, status: "pending" as const })),
        ...local.listWatching().map((movie) => ({ ...movie, status: "watching" as const })),
      ];
      const missing = migrated.filter((movie) => !remote.some((item) => item.id === movie.id));
      if (missing.length) {
        await Promise.all(missing.map((movie) => libraryApi.save("movie", movie.id, movie.status, movie)));
        remote = [...remote, ...missing];
      }
      if (migrated.length) {
        localStorage.removeItem(`watchlog.${user.id}.watched`);
        localStorage.removeItem(`watchlog.${user.id}.pending`);
        localStorage.removeItem(`watchlog.${user.id}.watching`);
      }
      const enriched = await Promise.all(remote.map(async (movie) => {
        if (movie.genres.length) return movie;
        try {
          const details = await movieApi.details(movie.id, movie.mediaType);
          const updated = { ...movie, ...details, status: movie.status };
          await libraryApi.save("movie", movie.id, movie.status, updated);
          return updated;
        } catch {
          return movie;
        }
      }));
      setAll(enriched);
    } catch {
      const local = new LocalWatchLog(user.id);
      setAll([
        ...local.list().map((movie) => ({ ...movie, status: "watched" as const })),
        ...local.listPending().map((movie) => ({ ...movie, status: "pending" as const })),
        ...local.listWatching().map((movie) => ({ ...movie, status: "watching" as const })),
      ]);
    }
  }, [user]);

  useEffect(() => { void refresh(); }, [refresh]);

  const saveStatus = useCallback(async (movie: Movie, status: LoggedMovie["status"]) => {
    const next = { ...movie, status };
    setAll((items) => [next, ...items.filter((item) => item.id !== movie.id)]);
    await libraryApi.save("movie", movie.id, status, next);
  }, []);

  const remove = useCallback(async (id: number) => {
    setAll((items) => items.filter((item) => item.id !== id));
    await libraryApi.remove("movie", id);
  }, []);

  const statusOf = useCallback((id: number) => all.find((movie) => movie.id === id)?.status, [all]);
  const watched = all.filter((movie) => movie.status === "watched");
  const pending = all.filter((movie) => movie.status === "pending");
  const watching = all.filter((movie) => movie.status === "watching");
  const isWatched = useCallback((id: number) => statusOf(id) === "watched", [statusOf]);
  const isPending = useCallback((id: number) => statusOf(id) === "pending", [statusOf]);
  const isWatching = useCallback((id: number) => statusOf(id) === "watching", [statusOf]);
  const markWatched = useCallback((movie: Movie) => void saveStatus(movie, "watched"), [saveStatus]);
  const markPending = useCallback((movie: Movie) => void saveStatus(movie, "pending"), [saveStatus]);
  const markWatching = useCallback((movie: Movie) => void saveStatus(movie, "watching"), [saveStatus]);
  const unmarkWatched = useCallback((id: number) => void remove(id), [remove]);
  const unmarkPending = useCallback((id: number) => void remove(id), [remove]);
  const unmarkWatching = useCallback((id: number) => void remove(id), [remove]);
  const updateWatchedMovie = useCallback(async (id: number, updates: Partial<Pick<Movie, "rating" | "review">>) => {
    const current = all.find((movie) => movie.id === id);
    if (!current) return;
    await saveStatus({ ...current, ...updates }, "watched");
  }, [all, saveStatus]);

  return { watched, pending, watching, all, statusOf, isWatched, isPending, isWatching, markWatched, unmarkWatched, markPending, unmarkPending, markWatching, unmarkWatching, remove, updateWatchedMovie };
}
