import { Link, useParams } from "react-router-dom";
import { useMovieDetails } from "../hooks/use-movie-details";
import { useWatchLogContext } from "../hooks/watch-log-context";

export function MovieDetailPage() {
  const { id } = useParams();
  const movieId = id ? Number(id) : undefined;
  const { movie, loading, error } = useMovieDetails(movieId);
  const { isWatched, markWatched, unmarkWatched } = useWatchLogContext();

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

  const watched = isWatched(movie.id);

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
          className={watched ? "btn" : "btn btn--primary"}
          onClick={() => (watched ? unmarkWatched(movie.id) : markWatched(movie))}
        >
          {watched ? "Quitar de vistas" : "Marcar como vista"}
        </button>
      </div>
    </article>
  );
}
