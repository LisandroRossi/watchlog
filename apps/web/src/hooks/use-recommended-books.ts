import { useEffect, useState } from "react";
import type { Book } from "@watchlog/shared";
import { bookApi } from "../infrastructure/book-api";

export function useRecommendedBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    bookApi.recommended()
      .then((page) => { setBooks(page.results); setError(null); })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { books, loading, error };
}