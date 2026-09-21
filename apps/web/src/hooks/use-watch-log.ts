import { useCallback, useEffect, useMemo, useState } from "react";
import type { Movie } from "@watchlog/shared";
import { LocalWatchLog } from "../infrastructure/local-watch-log";
import { useAuth } from "./auth-context";

export function useWatchLog() {
  const { user } = useAuth();
  const watchLog = useMemo(() => user ? new LocalWatchLog(user.id) : null, [user]);
  const [watched, setWatched] = useState<Movie[]>([]);
  const [pending, setPending] = useState<Movie[]>([]);
  const [watching, setWatching] = useState<Movie[]>([]);

  useEffect(() => {
    if (!watchLog) return;
    setWatched(watchLog.list());
    setPending(watchLog.listPending());
    setWatching(watchLog.listWatching());
  }, [watchLog]);

  const isWatched = useCallback((id: number) => watched.some((movie) => movie.id === id), [watched]);
  const isPending = useCallback((id: number) => pending.some((movie) => movie.id === id), [pending]);
  const isWatching = useCallback((id: number) => watching.some((movie) => movie.id === id), [watching]);

  const updateWatchedMovie = useCallback(
    (id: number, updates: Partial<Pick<Movie, "rating" | "review">>) => {
      if (!watchLog) return;
      watchLog.update(id, updates);
      setWatched(watchLog.list());
    },
    [watchLog],
  );

  const markWatched = useCallback((movie: Movie) => {
    if (!watchLog) return;
    watchLog.add(movie);
    watchLog.removePending(movie.id);
    watchLog.removeWatching(movie.id);
    setWatched(watchLog.list());
    setPending(watchLog.listPending());
    setWatching(watchLog.listWatching());
  }, [watchLog]);

  const unmarkWatched = useCallback((id: number) => {
    if (!watchLog) return;
    watchLog.remove(id);
    setWatched(watchLog.list());
  }, [watchLog]);

  const markPending = useCallback((movie: Movie) => {
    if (!watchLog) return;
    watchLog.remove(movie.id);
    watchLog.addPending(movie);
    watchLog.removeWatching(movie.id);
    setWatched(watchLog.list());
    setPending(watchLog.listPending());
    setWatching(watchLog.listWatching());
  }, [watchLog]);

  const unmarkPending = useCallback((id: number) => {
    if (!watchLog) return;
    watchLog.removePending(id);
    setPending(watchLog.listPending());
  }, [watchLog]);

  const markWatching = useCallback((movie: Movie) => {
    if (!watchLog) return;
    watchLog.remove(movie.id);
    watchLog.removePending(movie.id);
    watchLog.addWatching(movie);
    setWatched(watchLog.list());
    setPending(watchLog.listPending());
    setWatching(watchLog.listWatching());
  }, [watchLog]);

  const unmarkWatching = useCallback((id: number) => {
    if (!watchLog) return;
    watchLog.removeWatching(id);
    setWatching(watchLog.listWatching());
  }, [watchLog]);

  const remove = useCallback((id: number) => {
    if (!watchLog) return;
    watchLog.remove(id);
    watchLog.removePending(id);
    watchLog.removeWatching(id);
    setWatched(watchLog.list());
    setPending(watchLog.listPending());
    setWatching(watchLog.listWatching());
  }, [watchLog]);

  return {
    watched,
    pending,
    watching,
    isWatched,
    isPending,
    isWatching,
    updateWatchedMovie,
    markWatched,
    unmarkWatched,
    markPending,
    unmarkPending,
    markWatching,
    unmarkWatching,
    remove,
  };
}
