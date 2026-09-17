import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { Game, GameStatus } from "@watchlog/shared";
import { gameApi } from "../infrastructure/game-api";
import { useGameLogContext } from "../hooks/game-log-context";

export function GameDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const log = useGameLogContext();

  useEffect(() => {
    if (!id) return;
    gameApi.details(Number(id)).then(setGame).catch((err: Error) => setError(err.message));
  }, [id]);

  if (error || !game) return <div className="page"><p>{error ?? "Cargando..."}</p><Link to="/games">Volver a videojuegos</Link></div>;
  const status = log.statusOf(game.id);
  const saved = log.watched.find((item) => item.id === game.id);
  const updateStatus = (nextStatus: GameStatus) => log.setStatus(game, nextStatus);

  return <article className="page detail game-detail">
    {game.coverUrl ? <img src={game.coverUrl} alt="" /> : null}
    <div><Link to="/games" className="back">← Videojuegos</Link><h1>{game.title}</h1><p className="hero__meta">{game.releaseYear ?? "Año desconocido"}{game.genres.length ? ` · ${game.genres.join(", ")}` : ""}</p><p className="game-rating">{game.rating}/5</p><p className="hero__overview">{game.description}</p>
      <div className="hero__actions">{status === "playing" ? <><button className="btn btn--game-primary" onClick={() => updateStatus("replaying")}>Rejugando</button><button className="btn" onClick={() => updateStatus("abandoned")}>Abandonado</button></> : <><button className="btn" onClick={() => updateStatus("want")}>Quiero jugar</button><button className="btn btn--game-primary" onClick={() => updateStatus("completed")}>Jugado</button>{status === "want" ? <button className="btn" onClick={() => updateStatus("playing")}>Empezar a jugar</button> : null}</>}</div>
      {status === "completed" ? <div className="review-panel game-review"><label className="review-label">Tu valoración</label><div className="star-rating">{Array.from({ length: 5 }, (_, index) => { const value = index + 1; return <button key={value} type="button" className={((saved?.userRating ?? 0) >= value) ? "star star--filled" : "star"} onClick={() => log.updateWatchedGame(game.id, { userRating: value })} aria-label={`Calificar con ${value} estrellas`}>★</button>; })}</div><label className="review-label" htmlFor="game-review">Reseña</label><textarea id="game-review" value={saved?.review ?? ""} onChange={(event) => log.updateWatchedGame(game.id, { review: event.target.value })} placeholder="Contame qué te pareció este juego..." /></div> : null}
    </div>
  </article>;
}
