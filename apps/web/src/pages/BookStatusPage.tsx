import type { Book, BookStatus } from "@watchlog/shared";
import { BookGrid } from "../components/books/BookGrid";
import { ModeSwitcher } from "../components/layout/ModeSwitcher";
import { useBookLogContext } from "../hooks/book-log-context";

const labels: Record<BookStatus, string> = { read: "Leído", pending: "Pendiente", reading: "Leyendo" };

export function BookStatusPage({ status }: { status: BookStatus }) {
  const log = useBookLogContext();
  const books = log.byStatus(status);
  const setStatus = (book: Book, nextStatus: BookStatus) => log.setStatus(book, nextStatus);
  return <div className="page book-page"><ModeSwitcher /><header className="section-head"><div><span className="pill book-pill">Biblioteca</span><h1>{labels[status]}</h1></div></header><BookGrid books={books} statusOf={log.statusOf} onSetStatus={setStatus} statusOptions={status === "reading" ? ["read"] : undefined} onUpdatePage={status === "reading" ? (book, page) => log.updatePage(book.id, page) : undefined} onRemove={(book) => log.remove(book.id)} /></div>;
}
