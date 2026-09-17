import { MovieGrid } from "../components/movies/MovieGrid";
import { ModeSwitcher } from "../components/layout/ModeSwitcher";
import { useWatchLogContext } from "../hooks/watch-log-context";

export function PendingPage() {
  const { pending, isWatched, isPending, markWatched, unmarkWatched, unmarkPending } =
    useWatchLogContext();

  return (
    <div className="page">
      <ModeSwitcher />
      <h1>Películas pendientes</h1>
      <p className="lede">Películas que quieres ver más adelante.</p>
      <MovieGrid
        movies={pending}
        isWatched={isWatched}
        isPending={isPending}
        onToggleWatched={(movie) =>
          isWatched(movie.id) ? unmarkWatched(movie.id) : markWatched(movie)
        }
        onTogglePending={(movie) => unmarkPending(movie.id)}
      />
    </div>
  );
}
