import { useMemo, useState } from "react";
import type { Game, GameStatus } from "@watchlog/shared";
import { GameGrid } from "../components/games/GameGrid";
import { useGameLogContext } from "../hooks/game-log-context";
import { useGameSearch } from "../hooks/use-game-search";
import { usePopularGames } from "../hooks/use-popular-games";
import { ModeSwitcher } from "../components/layout/ModeSwitcher";

type GamesPageProps = {
  status?: GameStatus;
};

export function GamesPage({ status }: GamesPageProps) {
  const [query, setQuery] = useState("");
  const { games, loading, error } = usePopularGames();
  const search = useGameSearch(query);
  const log = useGameLogContext();
  const featured = games[0];
  const isSearching = query.trim().length > 0;
  const visible = useMemo(() => {
    if (status) return log.all.filter((game) => game.status === status);
    return isSearching ? search.games : games.slice(1, 13);
  }, [games, isSearching, log.all, search.games, status]);

  const setStatus = (game: Game, nextStatus: GameStatus) => log.setStatus(game, nextStatus);

  return (
    <div className="page game-page">
      <header className="topbar">
        <ModeSwitcher />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar videojuegos..." aria-label="Buscar videojuegos" />
      </header>
      <div className="game-heading"><span className="pill">RAWG collection</span><h1>Videojuegos</h1><p className="lede">Tu próxima partida, guardada en un solo lugar.</p></div>
      {error ? <p className="error">{error}</p> : null}
      {!isSearching && loading ? <p>Cargando catálogo...</p> : null}
      {!isSearching && !status && featured ? (
        <section className="game-hero">
          {featured.backgroundUrl ? <img src={featured.backgroundUrl} alt="" /> : null}
          <div><span className="pill">Destacado</span><h2>{featured.title}</h2><p className="hero__meta">{featured.releaseYear ?? "Año desconocido"} · {featured.rating}/5</p><p>{featured.description}</p><div className="hero__actions"><button className="btn" onClick={() => setStatus(featured, "want")} type="button">Quiero jugar</button><button className="btn btn--game-primary" onClick={() => setStatus(featured, "completed")} type="button">Jugado</button></div></div>
        </section>
      ) : null}
      <section><div className="section-head"><h2>{status ? ({ want: "Quiero Jugar", playing: "Jugando", completed: "Completado", abandoned: "Abandonado", replaying: "Rejugando" }[status]) : isSearching ? "Resultados" : "Más valorados"}</h2></div>{isSearching && search.loading ? <p>Buscando...</p> : null}<GameGrid games={visible} statusOf={log.statusOf} onWant={(game) => setStatus(game, "want")} onCompleted={(game) => setStatus(game, "completed")} onPlaying={(game) => setStatus(game, "playing")} onReplaying={(game) => setStatus(game, "replaying")} onAbandoned={(game) => setStatus(game, "abandoned")} /></section>
    </div>
  );
}
