import { useCallback, useEffect, useMemo, useState } from "react";
import type { Book, BookStatus } from "@watchlog/shared";
import { LocalBookLog } from "../infrastructure/local-book-log";
import { useAuth } from "./auth-context";

export function useBookLog() {
  const { user } = useAuth();
  const log = useMemo(() => user ? new LocalBookLog(user.id) : null, [user]);
  const [all, setAll] = useState<(Book & { status: BookStatus })[]>([]);

  const refresh = useCallback(() => {
    if (log) setAll(log.all());
  }, [log]);

  useEffect(refresh, [refresh]);

  const statusOf = useCallback((id: string) => all.find((book) => book.id === id)?.status, [all]);
  const byStatus = useCallback((status: BookStatus) => all.filter((book) => book.status === status), [all]);

  const setStatus = useCallback((book: Book, status: BookStatus) => {
    if (!log) return;
    const next = all.some((item) => item.id === book.id)
      ? all.map((item) => item.id === book.id ? { ...item, status } : item)
      : [{ ...book, status }, ...all];
    log.saveAll(next);
    refresh();
  }, [all, log, refresh]);

  const remove = useCallback((id: string) => {
    if (!log) return;
    log.saveAll(all.filter((book) => book.id !== id));
    refresh();
  }, [all, log, refresh]);

  const updatePage = useCallback((id: string, currentPage: number | undefined) => {
    if (!log) return;
    log.saveAll(all.map((book) => book.id === id ? { ...book, currentPage } : book));
    refresh();
  }, [all, log, refresh]);

  return { all, byStatus, statusOf, setStatus, remove, updatePage };
}
