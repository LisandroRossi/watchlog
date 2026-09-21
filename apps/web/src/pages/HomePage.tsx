import { useMemo, useState } from "react";
import { HeroFeatured } from "../components/movies/HeroFeatured";
import { MovieGrid } from "../components/movies/MovieGrid";
import { useMovieSearch } from "../hooks/use-movie-search";
import { usePopularMovies } from "../hooks/use-popular-movies";
import { useWatchLogContext } from "../hooks/watch-log-context";
import { ModeSwitcher } from "../components/layout/ModeSwitcher";
import { useMovieRecommendations } from "../hooks/use-recommendations";

export function HomePage() {
  const [query, setQuery] = useState("");
  const { movies, loading, error } = usePopularMovies();
  const search = useMovieSearch(query);
  const {
    isWatched,
    isPending,
    isWatching,
    markWatched,
    unmarkWatched,
    markPending,
    unmarkPending,
    markWatching,
    unmarkWatching,
    remove,
  } = useWatchLogContext();
  const { watched } = useWatchLogContext();
  const movieGenres = useMemo(() => watched.flatMap((movie) => movie.genres), [watched]);
  const recommendations = useMovieRecommendations(movieGenres);

  const featured = movies[0];
  const rest = movies.slice(1, 13);
  const isSearching = query.trim().length > 0;
  const visible = useMemo(
    () => (isSearching ? search.movies : rest),
    [isSearching, rest, search.movies],
  );

  return (
    <div className="page">
      <header className="topbar">
        <ModeSwitcher />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar películas..."
          aria-label="Buscar películas"
        />
      </header>

      {error ? <p className="error">{error}</p> : null}
      {!isSearching && loading ? <p>Cargando catálogo...</p> : null}
      {!isSearching && featured ? (
        <HeroFeatured
          movie={featured}
          watched={isWatched(featured.id)}
          pending={isPending(featured.id)}
          watching={isWatching(featured.id)}
          onToggleWatched={() =>
            isWatched(featured.id) ? unmarkWatched(featured.id) : markWatched(featured)
          }
          onTogglePending={() =>
            isPending(featured.id) ? unmarkPending(featured.id) : markPending(featured)
          }
          onToggleWatching={() =>
            isWatching(featured.id) ? unmarkWatching(featured.id) : markWatching(featured)
          }
        />
      ) : null}

      <section>
        <div className="section-head">
          <h2>{isSearching ? "Resultados" : "Populares"}</h2>
        </div>
        {isSearching && search.loading ? <p>Buscando...</p> : null}
        {isSearching && search.error ? <p className="error">{search.error}</p> : null}
        <MovieGrid
          movies={visible}
          isWatched={isWatched}
          isPending={isPending}
          onToggleWatched={(movie) =>
            isWatched(movie.id) ? unmarkWatched(movie.id) : markWatched(movie)
          }
          onTogglePending={(movie) =>
            isPending(movie.id) ? unmarkPending(movie.id) : markPending(movie)
          }
          isWatching={isWatching}
          onToggleWatching={(movie) =>
            isWatching(movie.id) ? unmarkWatching(movie.id) : markWatching(movie)
          }
          onRemove={(movie) => remove(movie.id)}
        />
      </section>
      {!isSearching && movieGenres.length ? <section className="recommendation-section">
        <div className="section-head"><div><h2>Recomendado para vos</h2><p className="recommendation-note">Basado en tus géneros más vistos. Los títulos vienen de TMDB.</p></div></div>
        {recommendations.loading ? <p>Cargando recomendaciones...</p> : null}
        {recommendations.error ? <p className="error">{recommendations.error}</p> : null}
        <MovieGrid movies={recommendations.items} isWatched={isWatched} isPending={isPending} isWatching={isWatching} onToggleWatched={(movie) => isWatched(movie.id) ? unmarkWatched(movie.id) : markWatched(movie)} onTogglePending={(movie) => isPending(movie.id) ? unmarkPending(movie.id) : markPending(movie)} onToggleWatching={(movie) => isWatching(movie.id) ? unmarkWatching(movie.id) : markWatching(movie)} onRemove={(movie) => remove(movie.id)} />
      </section> : null}
    </div>
  );
}
