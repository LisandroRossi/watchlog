import { MovieGrid } from "../components/movies/MovieGrid";
import { ModeSwitcher } from "../components/layout/ModeSwitcher";
import { useWatchLogContext } from "../hooks/watch-log-context";

export function WatchedPage() {
  const { watched, isWatched } = useWatchLogContext();

  return (
    <div className="page">
      <ModeSwitcher />
      <h1>Películas vistas</h1>
      <p className="lede">
        Marcá películas desde el detalle para ir armando tu bitácora. Se guarda en este
        navegador.
      </p>
      <MovieGrid movies={watched} isWatched={isWatched} />
    </div>
  );
}
