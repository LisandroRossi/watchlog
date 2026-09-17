import { Link } from "react-router-dom";
import type { Movie } from "@watchlog/shared";

type MovieCardProps = {
  movie: Movie;
  watched?: boolean;
  pending?: boolean;
  onToggleWatched?: () => void;
  onTogglePending?: () => void;
};

export function MovieCard({
  movie,
  watched,
  pending,
  onToggleWatched,
  onTogglePending,
}: MovieCardProps) {
  return (
    <article className="card">
      <Link to={`/movie/${movie.id}?type=${movie.mediaType ?? "movie"}`} className="card__link">
        {movie.posterPath ? (
          <img src={movie.posterPath} alt="" />
        ) : (
          <div className="card__placeholder">{movie.title}</div>
        )}
        {watched ? <span className="badge">Vista</span> : null}
        {pending && !watched ? <span className="badge badge--pending">Pendiente</span> : null}
        <div className="card__meta">
          <h3>{movie.title}</h3>
          <p>
            {movie.releaseYear ?? "—"} · {movie.voteAverage}/10
          </p>
          {movie.rating ? <p className="card__rating">⭐ {movie.rating}/5</p> : null}
        </div>
      </Link>
      {onToggleWatched && onTogglePending ? (
        <div className="card__actions">
          <button
            className={watched ? "btn btn--small btn--active" : "btn btn--small"}
            onClick={onToggleWatched}
            type="button"
          >
            {watched ? "Vista" : "Marcar vista"}
          </button>
          <button
            className={pending ? "btn btn--small btn--pending" : "btn btn--small"}
            onClick={onTogglePending}
            type="button"
          >
            {pending ? "Quitar pendiente" : "Pendiente"}
          </button>
        </div>
      ) : null}
    </article>
  );
}
