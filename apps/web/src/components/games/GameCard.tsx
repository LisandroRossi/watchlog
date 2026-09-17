import { Link } from "react-router-dom";
import type { Game, GameStatus } from "@watchlog/shared";

type Props = {
  game: Game;
  status?: GameStatus;
  onWant?: () => void;
  onCompleted?: () => void;
  onPlaying?: () => void;
  onReplaying?: () => void;
  onAbandoned?: () => void;
};

export function GameCard({ game, status, onWant, onCompleted, onPlaying, onReplaying, onAbandoned }: Props) {
  return (
    <article className="card game-card">
      <Link to={`/games/${game.id}`} className="card__link">
        {game.coverUrl ? <img src={game.coverUrl} alt="" /> : <div className="card__placeholder">{game.title}</div>}
        {status ? <span className={`badge ${status === "completed" ? "game-badge" : "badge--pending"}`}>{status === "want" ? "Quiero jugar" : status === "playing" ? "Jugando" : status === "completed" ? "Jugado" : status === "replaying" ? "Rejugando" : "Abandonado"}</span> : null}
        <div className="card__meta">
          <h3>{game.title}</h3>
          <p>{game.releaseYear ?? "—"} · {game.rating}/5</p>
        </div>
      </Link>
      {onWant && onCompleted ? (
        <div className="card__actions">
          {status === "playing" ? (
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
          {status === "want" && onPlaying ? <button className="btn btn--small btn--game-primary" onClick={onPlaying} type="button">Empezar</button> : null}
        </div>
      ) : null}
    </article>
  );
}
