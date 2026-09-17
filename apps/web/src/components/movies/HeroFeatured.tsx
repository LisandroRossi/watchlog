import { Link } from "react-router-dom";
import type { Movie } from "@watchlog/shared";

type HeroFeaturedProps = {
  movie: Movie;
  watched: boolean;
  pending: boolean;
  onToggleWatched: () => void;
  onTogglePending: () => void;
};

export function HeroFeatured({
  movie,
  watched,
  pending,
  onToggleWatched,
  onTogglePending,
}: HeroFeaturedProps) {
  return (
    <section className="hero">
      {movie.posterPath ? (
        <img className="hero__poster" src={movie.posterPath} alt="" />
      ) : null}
      <div className="hero__copy">
        <span className="pill">Destacada de hoy</span>
        <h1>{movie.title}</h1>
        <p className="hero__meta">
          {movie.releaseYear ?? "Año desconocido"}
          {movie.genres.length ? ` · ${movie.genres.join(", ")}` : ""}
          {watched ? " · Vista" : ""}
        </p>
        <p className="hero__rating">{movie.voteAverage}/10</p>
        <p className="hero__overview">{movie.overview}</p>
        <div className="hero__actions">
          <Link className="btn btn--primary" to={`/movie/${movie.id}?type=${movie.mediaType ?? "movie"}`}>
            Ver detalles
          </Link>
          <button className="btn" onClick={onToggleWatched} type="button">
            {watched ? "Quitar vista" : "Marcar vista"}
          </button>
          <button className="btn" onClick={onTogglePending} type="button">
            {pending ? "Quitar pendiente" : "Pendiente"}
          </button>
        </div>
      </div>
    </section>
  );
}
