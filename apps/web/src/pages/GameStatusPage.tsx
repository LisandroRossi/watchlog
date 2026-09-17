import type { Game, GameStatus } from "@watchlog/shared";
import { GameGrid } from "../components/games/GameGrid";
import { ModeSwitcher } from "../components/layout/ModeSwitcher";
import { useGameLogContext } from "../hooks/game-log-context";

type GameStatusPageProps = {
  status: GameStatus;
};

const statusLabels: Record<GameStatus, string> = {
  want: "Quiero Jugar",
  playing: "Jugando",
  completed: "Completado",
  abandoned: "Abandonado",
  replaying: "Rejugando",
};

export function GameStatusPage({ status }: GameStatusPageProps) {
  const log = useGameLogContext();
  const games = log.all.filter((game) => game.status === status);
  const setStatus = (game: Game, nextStatus: GameStatus) => log.setStatus(game, nextStatus);

  return (
    <div className="page game-page game-status-page">
      <ModeSwitcher />
      <header className="section-head">
        <div>
          <span className="pill">RAWG collection</span>
          <h1>{statusLabels[status]}</h1>
        </div>
      </header>
      <GameGrid
        games={games}
        statusOf={log.statusOf}
        onWant={(game) => setStatus(game, "want")}
        onCompleted={(game) => setStatus(game, "completed")}
        onPlaying={(game) => setStatus(game, "playing")}
        onReplaying={(game) => setStatus(game, "replaying")}
        onAbandoned={(game) => setStatus(game, "abandoned")}
      />
    </div>
  );
}
