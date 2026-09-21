import { MovieGrid } from "../components/movies/MovieGrid";
import { ModeSwitcher } from "../components/layout/ModeSwitcher";
import { useWatchLogContext } from "../hooks/watch-log-context";

export function WatchingPage() {
  const { watching, isWatching, unmarkWatching, markWatched } = useWatchLogContext();

  return (
    <div className="page">
      <ModeSwitcher />
      <h1>Mirando</h1>
      <p className="lede">Series y películas que estás siguiendo ahora.</p>
      <MovieGrid movies={watching} isWatched={() => false} isWatching={isWatching} onMarkWatched={markWatched} onRemove={(movie) => unmarkWatching(movie.id)} />
    </div>
  );
}