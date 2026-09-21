import { useMemo } from "react";
import { ModeSwitcher } from "../components/layout/ModeSwitcher";
import { useWatchLogContext } from "../hooks/watch-log-context";

function percentage(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0;
}

export function MovieStatsPage() {
  const { watched } = useWatchLogContext();
  const genres = useMemo(() => {
    const counts = new Map<string, number>();
    watched.forEach((movie) => movie.genres.forEach((genre) => counts.set(genre, (counts.get(genre) ?? 0) + 1)));
    return [...counts.entries()].sort((left, right) => right[1] - left[1]);
  }, [watched]);

  return (
    <div className="page stats-page movie-stats-page">
      <ModeSwitcher />
      <header className="section-head stats-heading"><div><span className="pill">TMDB collection</span><h1>Estadísticas de películas y series</h1><p className="lede">Los géneros que más miraste.</p></div></header>
      <section className="stats-summary"><article className="stat-card"><strong>{watched.length}</strong><span>Películas y series vistas</span></article><article className="stat-card"><strong>{genres.length}</strong><span>Géneros explorados</span></article></section>
      <section className="stats-panel"><h2>Géneros que miraste</h2>{genres.length ? <div className="stats-bars">{genres.map(([genre, count]) => <div className="stats-row" key={genre}><div><span>{genre}</span><b>{percentage(count, watched.length)}%</b></div><span className="stats-track"><span style={{ width: `${percentage(count, watched.length)}%` }} /></span></div>)}</div> : <p className="empty">Todavía no hay películas o series vistas para analizar.</p>}</section>
    </div>
  );
}
