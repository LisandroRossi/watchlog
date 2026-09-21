import { useMemo } from "react";
import { ModeSwitcher } from "../components/layout/ModeSwitcher";
import { useGameLogContext } from "../hooks/game-log-context";

function percentage(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0;
}

export function GameStatsPage() {
  const { all } = useGameLogContext();
  const played = all.filter((game) => ["completed", "platinado", "replaying"].includes(game.status ?? ""));
  const completed = all.filter((game) => game.status === "completed");
  const abandoned = all.filter((game) => game.status === "abandoned");
  const platinum = all.filter((game) => game.status === "platinado");

  const genres = useMemo(() => {
    const counts = new Map<string, number>();
    played.forEach((game) => game.genres.forEach((genre) => counts.set(genre, (counts.get(genre) ?? 0) + 1)));
    return [...counts.entries()].sort((left, right) => right[1] - left[1]);
  }, [played]);

  return (
    <div className="page game-page stats-page">
      <ModeSwitcher />
      <header className="game-heading">
        <span className="pill">RAWG collection</span>
        <h1>Estadísticas de videojuegos</h1>
        <p className="lede">Una vista rápida de tu forma de jugar.</p>
      </header>
      <section className="stats-summary">
        <article className="stat-card"><strong>{abandoned.length}</strong><span>Abandonados</span></article>
        <article className="stat-card"><strong>{completed.length}</strong><span>Completados</span></article>
        <article className="stat-card"><strong>{percentage(platinum.length, all.length)}%</strong><span>Platinados</span></article>
        <article className="stat-card"><strong>{played.length}</strong><span>Juegos jugados</span></article>
      </section>
      <section className="stats-panel">
        <h2>Géneros jugados</h2>
        {genres.length ? <div className="stats-bars">{genres.map(([genre, count]) => <div className="stats-row" key={genre}><div><span>{genre}</span><b>{percentage(count, played.length)}%</b></div><span className="stats-track"><span style={{ width: `${percentage(count, played.length)}%` }} /></span></div>)}</div> : <p className="empty">Todavía no hay juegos jugados para analizar.</p>}
      </section>
      <section className="stats-panel">
        <h2>Progreso de platinado</h2>
        <div className="stats-progress"><span style={{ width: `${percentage(platinum.length, all.length)}%` }} /></div>
        <p className="stats-note">{platinum.length} de {all.length} juegos guardados están platinados.</p>
      </section>
    </div>
  );
}
