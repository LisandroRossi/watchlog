import type { Book, BookStatus } from "@watchlog/shared";
import { BookCard } from "./BookCard";

type Props = {
  books: (Book & { status?: BookStatus })[];
  statusOf?: (id: string) => BookStatus | undefined;
  onSetStatus?: (book: Book, status: BookStatus) => void;
  onRemove?: (book: Book) => void;
  statusOptions?: BookStatus[];
  onUpdatePage?: (book: Book, page: number | undefined) => void;
};

export function BookGrid({ books, statusOf, onSetStatus, onRemove, statusOptions, onUpdatePage }: Props) {
  if (!books.length) return <p className="empty">No hay libros para mostrar.</p>;
  return <div className="grid">{books.map((book) => <BookCard key={book.id} book={book} status={statusOf ? statusOf(book.id) : book.status} onSetStatus={onSetStatus ? (status) => onSetStatus(book, status) : undefined} onRemove={onRemove ? () => onRemove(book) : undefined} statusOptions={statusOptions} onUpdatePage={onUpdatePage ? (page) => onUpdatePage(book, page) : undefined} />)}</div>;
}
