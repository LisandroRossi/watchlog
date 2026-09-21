import type { Book, BookStatus } from "@watchlog/shared";

type Props = {
  book: Book;
  status?: BookStatus;
  onSetStatus?: (status: BookStatus) => void;
  onRemove?: () => void;
  statusOptions?: BookStatus[];
  onUpdatePage?: (page: number | undefined) => void;
};

const labels: Record<BookStatus, string> = { read: "Leído", pending: "Pendiente", reading: "Leyendo" };

export function BookCard({ book, status, onSetStatus, onRemove, statusOptions = ["read", "reading", "pending"], onUpdatePage }: Props) {
  return (
    <article className={`card book-card${onRemove && status ? " card--has-remove" : ""}`}>
      {onRemove && status ? <button className="card__remove" onClick={onRemove} type="button" aria-label={`Borrar ${book.title}`} title="Borrar de tu lista">×</button> : null}
      <div className="card__link">
        {book.coverUrl ? <img src={book.coverUrl} alt="" /> : <div className="card__placeholder">{book.title}</div>}
        {status ? <span className="badge book-badge">{labels[status]}</span> : null}
        <div className="card__meta">
          <h3>{book.title}</h3>
          <p>{book.authors.join(", ") || "Autor desconocido"}</p>
          <p>{book.firstPublishYear ?? "Año desconocido"}{book.pageCount ? ` · ${book.pageCount} páginas` : ""}</p>
          {status === "reading" && onUpdatePage ? <label className="book-progress">Página actual
            <input
              type="number"
              min="0"
              max={book.pageCount ?? undefined}
              value={book.currentPage ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                onUpdatePage(value === "" ? undefined : Math.max(0, Number(value)));
              }}
              aria-label={`Página actual de ${book.title}`}
            />
          </label> : null}
        </div>
      </div>
      {onSetStatus ? <div className={`card__actions card__actions--book${statusOptions.length === 1 ? " card__actions--book-single" : ""}`}>
        {statusOptions.includes("read") ? <button className={`btn btn--small${status === "read" ? " btn--active" : ""}`} onClick={() => onSetStatus("read")} type="button">Leído</button> : null}
        {statusOptions.includes("reading") ? <button className={`btn btn--small${status === "reading" ? " btn--book-active" : ""}`} onClick={() => onSetStatus("reading")} type="button">Leyendo</button> : null}
        {statusOptions.includes("pending") ? <button className={`btn btn--small${status === "pending" ? " btn--pending" : ""}`} onClick={() => onSetStatus("pending")} type="button">Pendiente</button> : null}
      </div> : null}
    </article>
  );
}
