import { useMemo, useState } from "react";
import type { Book, BookStatus } from "@watchlog/shared";
import { BookGrid } from "../components/books/BookGrid";
import { ModeSwitcher } from "../components/layout/ModeSwitcher";
import { useBookLogContext } from "../hooks/book-log-context";
import { useBookSearch } from "../hooks/use-book-search";

export function BooksPage() {
  const [query, setQuery] = useState("");
  const search = useBookSearch(query);
  const log = useBookLogContext();
  const visible = useMemo(() => query.trim() ? search.books : log.all, [log.all, query, search.books]);
  const setStatus = (book: Book, status: BookStatus) => log.setStatus(book, status);

  return <div className="page book-page">
    <header className="topbar"><ModeSwitcher /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar libros..." aria-label="Buscar libros" /></header>
    <div className="book-heading"><span className="pill book-pill">Open Library</span><h1>Libros</h1><p className="lede">Tu biblioteca, tus próximas lecturas y las historias que estás leyendo.</p></div>
    {search.loading ? <p>Cargando libros...</p> : null}
    {search.error ? <p className="error">{search.error}</p> : null}
    <BookGrid books={visible} statusOf={log.statusOf} onSetStatus={setStatus} onRemove={(book) => log.remove(book.id)} />
  </div>;
}
