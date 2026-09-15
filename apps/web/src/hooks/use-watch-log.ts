import { useCallback, useEffect, useState } from "react";
import type { Movie } from "@watchlog/shared";
import { LocalWatchLog } from "../infrastructure/local-watch-log";

const watchLog = new LocalWatchLog();

export function useWatchLog() {
  const [watched, setWatched] = useState<Movie[]>([]);
  const [pending, setPending] = useState<Movie[]>([]);

  useEffect(() => {
    setWatched(watchLog.list());
    setPending(watchLog.listPending());
  }, []);

  const isWatched = useCallback((id: number) => watched.some((movie) => movie.id === id), [watched]);
  const isPending = useCallback((id: number) => pending.some((movie) => movie.id === id), [pending]);

  const markWatched = useCallback((movie: Movie) => {
    watchLog.add(movie);
    watchLog.removePending(movie.id);
    setWatched(watchLog.list());
    setPending(watchLog.listPending());
  }, []);

  const unmarkWatched = useCallback((id: number) => {
    watchLog.remove(id);
    setWatched(watchLog.list());
  }, []);

  const markPending = useCallback((movie: Movie) => {
    watchLog.remove(movie.id);
    watchLog.addPending(movie);
    setWatched(watchLog.list());
    setPending(watchLog.listPending());
  }, []);

  const unmarkPending = useCallback((id: number) => {
    watchLog.removePending(id);
    setPending(watchLog.listPending());
  }, []);

  return {
    watched,
    pending,
    isWatched,
    isPending,
    markWatched,
    unmarkWatched,
    markPending,
    unmarkPending,
  };
}
