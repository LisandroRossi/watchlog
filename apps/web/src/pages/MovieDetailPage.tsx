import { Link, useParams } from "react-router-dom";
import type { Movie } from "@watchlog/shared";
import { useMovieDetails } from "../hooks/use-movie-details";
import { useWatchLogContext } from "../hooks/watch-log-context";

export function MovieDetailPage() {
  const { id } = useParams();
  const movieId = id ? Number(id) : undefined;
  const mediaType = new URLSearchParams(window.location.search).get("type") as Movie["mediaType"];
  const { movie, loading, error } = useMovieDetails(movieId, mediaType);
  const { watched: watchedMovies, isWatched, isWatching, markWatched, unmarkWatched, markWatching, unmarkWatching, updateWatchedMovie } =
    useWatchLogContext();

  if (loading) {
    return <p className="page">Cargando...</p>;
  }

  if (error || !movie) {
    return (
      <div className="page">
        <p className="error">{error ?? "No encontrada."}</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }

  const watchedMovie = watchedMovies.find((entry) => entry.id === movie.id);
  const isMovieWatched = isWatched(movie.id);

  return (
    <article className="page detail">
      {movie.posterPath ? <img src={movie.posterPath} alt="" /> : null}
      <div>
        <Link to="/" className="back">
          ← Inicio
        </Link>
        <h1>{movie.title}</h1>
        <p className="hero__meta">
          {movie.releaseYear ?? "Año desconocido"}
          {movie.genres.length ? ` · ${movie.genres.join(", ")}` : ""}
        </p>
        <p className="hero__rating">{movie.voteAverage}/10</p>
        <p className="hero__overview">{movie.overview}</p>
        <button
          className={isMovieWatched ? "btn" : "btn btn--primary"}
          onClick={() => (isMovieWatched ? unmarkWatched(movie.id) : markWatched(movie))}
        >
          {isMovieWatched ? "Quitar de vistas" : "Marcar como vista"}
        </button>
        <button
          className={isWatching(movie.id) ? "btn btn--watching" : "btn"}
          onClick={() => (isWatching(movie.id) ? unmarkWatching(movie.id) : markWatching(movie))}
        >
          {isWatching(movie.id) ? "Quitar de mirando" : "Agregar a mirando"}
        </button>

        {isMovieWatched ? (
          <div className="review-panel">
            <div>
              <label className="review-label">Tu valoración</label>
              <div className="star-rating" aria-label="Valoración en estrellas">
                {Array.from({ length: 5 }, (_, index) => {
                  const value = index + 1;
                  const filled = (watchedMovie?.rating ?? 0) >= value;

                  return (
                    <button
                      key={value}
                      type="button"
                      className={filled ? "star star--filled" : "star"}
                      onClick={() => updateWatchedMovie(movie.id, { rating: value })}
                      aria-label={`Calificar con ${value} estrellas`}
                    >
                      {filled ? "★" : "☆"}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="review-field">
              <label htmlFor="movie-review" className="review-label">
                Reseña
              </label>
              <textarea
                id="movie-review"
                value={watchedMovie?.review ?? ""}
                onChange={(event) =>
                  updateWatchedMovie(movie.id, { review: event.target.value })
                }
                placeholder="Contame qué te pareció esta película..."
              />
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
}
