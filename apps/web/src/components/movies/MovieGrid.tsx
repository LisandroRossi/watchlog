import type { Movie } from "@watchlog/shared";
import { MovieCard } from "./MovieCard";

type MovieGridProps = {
  movies: Movie[];
  isWatched: (id: number) => boolean;
  isPending?: (id: number) => boolean;
  isWatching?: (id: number) => boolean;
  onToggleWatched?: (movie: Movie) => void;
  onTogglePending?: (movie: Movie) => void;
  onToggleWatching?: (movie: Movie) => void;
  onMarkWatched?: (movie: Movie) => void;
  onRemove?: (movie: Movie) => void;
};

export function MovieGrid({
  movies,
  isWatched,
  isPending,
  isWatching,
  onToggleWatched,
  onTogglePending,
  onToggleWatching,
  onMarkWatched,
  onRemove,
}: MovieGridProps) {
  if (movies.length === 0) {
    return <p className="empty">No hay películas para mostrar.</p>;
  }

  return (
    <div className="grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          watched={isWatched(movie.id)}
          pending={isPending?.(movie.id)}
          watching={isWatching?.(movie.id)}
          onToggleWatched={onToggleWatched ? () => onToggleWatched(movie) : undefined}
          onTogglePending={onTogglePending ? () => onTogglePending(movie) : undefined}
          onToggleWatching={onToggleWatching ? () => onToggleWatching(movie) : undefined}
          onMarkWatched={onMarkWatched ? () => onMarkWatched(movie) : undefined}
          onRemove={onRemove ? () => onRemove(movie) : undefined}
        />
      ))}
    </div>
  );
}
