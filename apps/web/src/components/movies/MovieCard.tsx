import { Link } from "react-router-dom";
import type { Movie } from "@watchlog/shared";

type MovieCardProps = {
  movie: Movie;
  watched?: boolean;
  pending?: boolean;
  watching?: boolean;
  onToggleWatched?: () => void;
  onTogglePending?: () => void;
  onToggleWatching?: () => void;
  onMarkWatched?: () => void;
  onRemove?: () => void;
};

export function MovieCard({
  movie,
  watched,
  pending,
  watching,
  onToggleWatched,
  onTogglePending,
  onToggleWatching,
  onMarkWatched,
  onRemove,
}: MovieCardProps) {
  return (
    <article className={`card${onRemove && (watched || pending || watching) ? " card--has-remove" : ""}`}>
      {onRemove && (watched || pending || watching) ? (
        <button
          className="card__remove"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onRemove();
          }}
          type="button"
          aria-label={`Borrar ${movie.title}`}
          title="Borrar de tu lista"
        >
          ×
        </button>
      ) : null}
      <Link to={`/movie/${movie.id}?type=${movie.mediaType ?? "movie"}`} className="card__link">
        {movie.posterPath ? (
          <img src={movie.posterPath} alt="" />
        ) : (
          <div className="card__placeholder">{movie.title}</div>
        )}
        {watched ? <span className="badge">Vista</span> : null}
        {pending && !watched ? <span className="badge badge--pending">Pendiente</span> : null}
        {watching && !watched && !pending ? <span className="badge badge--watching">Mirando</span> : null}
        <div className="card__meta">
          <h3>{movie.title}</h3>
          <p>
            {movie.releaseYear ?? "—"} · {movie.voteAverage}/10
          </p>
          {movie.rating ? <p className="card__rating">⭐ {movie.rating}/5</p> : null}
        </div>
      </Link>
      {onToggleWatched || onTogglePending || onToggleWatching || onMarkWatched ? (
        <div className={`card__actions card__actions--movie${onMarkWatched && !onToggleWatched && !onTogglePending && !onToggleWatching ? " card__actions--single" : ""}`}>
          {onMarkWatched ? <button className="btn btn--small btn--active" onClick={onMarkWatched} type="button">Vista</button> : null}
          {onToggleWatched ? <button
            className={watched ? "btn btn--small btn--active" : "btn btn--small"}
            onClick={onToggleWatched}
            type="button"
          >
            {watched ? "Vista" : "Marcar vista"}
          </button> : null}
          {onTogglePending ? <button
            className={pending ? "btn btn--small btn--pending" : "btn btn--small"}
            onClick={onTogglePending}
            type="button"
          >
            {pending ? "Quitar pendiente" : "Pendiente"}
          </button> : null}
          {onToggleWatching ? <button
            className={watching ? "btn btn--small btn--watching" : "btn btn--small"}
            onClick={onToggleWatching}
            type="button"
          >
            {watching ? "Quitar mirando" : "Mirando"}
          </button> : null}
        </div>
      ) : null}
    </article>
  );
}
