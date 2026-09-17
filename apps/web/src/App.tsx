import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";
import { useWatchLogContext } from "./hooks/watch-log-context";
import { useGameLogContext } from "./hooks/game-log-context";

export function App() {
  const { watched, pending } = useWatchLogContext();
  const { watched: playedGames, pending: wantedGames, all: allGames } = useGameLogContext();
  const gameCount = (status: "playing" | "abandoned" | "replaying") =>
    allGames.filter((game) => game.status === status).length;
  const isGames = useLocation().pathname.startsWith("/games");

  return (
    <div className={isGames ? "shell shell--games" : "shell"}>
      <Sidebar
        watchedCount={watched.length}
        pendingCount={pending.length}
        gameCompletedCount={playedGames.length}
        gameWantedCount={wantedGames.length}
        gamePlayingCount={gameCount("playing")}
        gameAbandonedCount={gameCount("abandoned")}
        gameReplayingCount={gameCount("replaying")}
        isGames={isGames}
      />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
