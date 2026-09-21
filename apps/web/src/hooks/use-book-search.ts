import { useEffect, useState } from "react";
import type { Book } from "@watchlog/shared";
import { bookApi } from "../infrastructure/book-api";

export function useBookSearch(query: string) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setBooks([]);
      setLoading(false);
      setError(null);
      return;
    }
    const handle = window.setTimeout(() => {
      setLoading(true);
      bookApi.search(trimmed)
        .then((page) => { setBooks(page.results); setError(null); })
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
    }, 350);
    return () => window.clearTimeout(handle);
  }, [query]);

  return { books, loading, error };
}
