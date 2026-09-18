import { Link } from "react-router-dom";
import type { Game, GameStatus } from "@watchlog/shared";

type Props = {
  game: Game;
  status?: GameStatus;
  actionMode?: GameStatus;
  onWant?: () => void;
  onCompleted?: () => void;
  onPlaying?: () => void;
  onReplaying?: () => void;
  onAbandoned?: () => void;
  onPlatinado?: () => void;
};

export function GameCard({ game, status, actionMode, onWant, onCompleted, onPlaying, onReplaying, onAbandoned, onPlatinado }: Props) {
  return (
    <article className="card game-card">
      <Link to={`/games/${game.id}`} className="card__link">
        {game.coverUrl ? <img src={game.coverUrl} alt="" /> : <div className="card__placeholder">{game.title}</div>}
        {status ? <span className={`badge ${status === "completed" || status === "platinado" ? "game-badge" : "badge--pending"}`}>{status === "want" ? "Quiero jugar" : status === "playing" ? "Jugando" : status === "completed" ? "Jugado" : status === "replaying" ? "Rejugando" : status === "platinado" ? "Platinado" : "Abandonado"}</span> : null}
        <div className="card__meta">
          <h3>{game.title}</h3>
          <p>{game.releaseYear ?? "—"} · {game.rating}/5</p>
        </div>
      </Link>
      {onWant && onCompleted && actionMode !== "platinado" ? (
        <div className="card__actions">
          {actionMode === "want" ? (
            <button className="btn btn--small btn--game-primary" onClick={onPlaying} type="button">Empezar</button>
          ) : actionMode === "completed" ? (
            <>
              <button className="btn btn--small btn--game-primary" onClick={onReplaying} type="button">Quiero rejugarlo</button>
              <button className="btn btn--small btn--active" onClick={onPlatinado} type="button">Platinado</button>
            </>
          ) : actionMode === "playing" ? (
            <>
              <button className="btn btn--small btn--active" onClick={onCompleted} type="button">Completado</button>
              <button className="btn btn--small" onClick={onAbandoned} type="button">Abandonado</button>
              <button className="btn btn--small btn--pending" onClick={onReplaying} type="button">Rejugando</button>
            </>
          ) : actionMode === "replaying" ? (
            <>
              <button className="btn btn--small btn--active" onClick={onCompleted} type="button">Completado</button>
              <button className="btn btn--small btn--game-primary" onClick={onPlatinado} type="button">Platinado</button>
            </>
          ) : actionMode === "abandoned" ? (
            <button className="btn btn--small btn--game-primary" onClick={onPlaying} type="button">Retomar Juego</button>
          ) : status === "playing" ? (
            <>
              <button className="btn btn--small btn--pending" onClick={onReplaying} type="button">Rejugando</button>
              <button className="btn btn--small" onClick={onAbandoned} type="button">Abandonado</button>
            </>
          ) : (
            <>
              <button className={status === "want" ? "btn btn--small btn--pending" : "btn btn--small"} onClick={onWant} type="button">Quiero jugar</button>
              <button className={status === "completed" ? "btn btn--small btn--active" : "btn btn--small"} onClick={onCompleted} type="button">Jugado</button>
            </>
          )}
          {status === "want" && actionMode !== "want" && onPlaying ? <button className="btn btn--small btn--game-primary" onClick={onPlaying} type="button">Empezar</button> : null}
        </div>
      ) : null}
    </article>
  );
}
