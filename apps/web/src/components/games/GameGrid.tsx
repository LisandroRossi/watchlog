import type { Game, GameStatus } from "@watchlog/shared";
import { GameCard } from "./GameCard";

type Props = {
  games: Game[];
  statusOf: (id: number) => GameStatus | undefined;
  actionMode?: GameStatus;
  onWant?: (game: Game) => void;
  onCompleted?: (game: Game) => void;
  onPlaying?: (game: Game) => void;
  onReplaying?: (game: Game) => void;
  onAbandoned?: (game: Game) => void;
  onPlatinado?: (game: Game) => void;
  onRemove?: (game: Game) => void;
};

export function GameGrid({ games, statusOf, actionMode, onWant, onCompleted, onPlaying, onReplaying, onAbandoned, onPlatinado, onRemove }: Props) {
  if (!games.length) return <p className="empty">No hay videojuegos para mostrar.</p>;
  return (
    <div className="grid">
      {games.map((game) => (
        <GameCard
          key={game.id}
          game={game}
          status={statusOf(game.id)}
          actionMode={actionMode}
          onWant={onWant ? () => onWant(game) : undefined}
          onCompleted={onCompleted ? () => onCompleted(game) : undefined}
          onPlaying={onPlaying ? () => onPlaying(game) : undefined}
          onReplaying={onReplaying ? () => onReplaying(game) : undefined}
          onAbandoned={onAbandoned ? () => onAbandoned(game) : undefined}
          onPlatinado={onPlatinado ? () => onPlatinado(game) : undefined}
          onRemove={onRemove ? () => onRemove(game) : undefined}
        />
      ))}
    </div>
  );
}
