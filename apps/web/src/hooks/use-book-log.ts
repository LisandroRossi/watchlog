import { useCallback, useEffect, useState } from "react";
import type { Book, BookStatus } from "@watchlog/shared";
import { libraryApi } from "../infrastructure/library-api";
import { LocalBookLog } from "../infrastructure/local-book-log";
import { useAuth } from "./auth-context";

type LoggedBook = Book & { status: BookStatus };

export function useBookLog() {
  const { user } = useAuth();
  const [all, setAll] = useState<LoggedBook[]>([]);

  const refresh = useCallback(async () => {
    if (!user) return;
    try {
      let remote = (await libraryApi.list<LoggedBook>("book")).items;
      const local = new LocalBookLog(user.id);
      const migrated = local.all();
      const missing = migrated.filter((book) => !remote.some((item) => item.id === book.id));
      if (missing.length) {
        await Promise.all(missing.map((book) => libraryApi.save("book", book.id, book.status, book)));
        remote = [...remote, ...missing];
      }
      if (migrated.length) {
        localStorage.removeItem(`watchlog.${user.id}.books`);
      }
      setAll(remote);
    } catch {
      setAll(new LocalBookLog(user.id).all());
    }
  }, [user]);

  useEffect(() => { void refresh(); }, [refresh]);

  const setStatus = useCallback(async (book: Book, status: BookStatus) => {
    const next = { ...book, status };
    setAll((items) => [next, ...items.filter((item) => item.id !== book.id)]);
    await libraryApi.save("book", book.id, status, next);
  }, []);

  const remove = useCallback(async (id: string) => {
    setAll((items) => items.filter((book) => book.id !== id));
    await libraryApi.remove("book", id);
  }, []);

  const updatePage = useCallback(async (id: string, currentPage: number | undefined) => {
    const current = all.find((book) => book.id === id);
    if (current) await setStatus({ ...current, currentPage }, "reading");
  }, [all, setStatus]);

  const statusOf = useCallback((id: string) => all.find((book) => book.id === id)?.status, [all]);
  const byStatus = useCallback((status: BookStatus) => all.filter((book) => book.status === status), [all]);

  return { all, byStatus, statusOf, setStatus, remove, updatePage };
}
