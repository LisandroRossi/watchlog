import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./components/layout/Sidebar";
import { useWatchLogContext } from "./hooks/watch-log-context";
import { useGameLogContext } from "./hooks/game-log-context";
import { useAuth } from "./hooks/auth-context";
import { useBookLogContext } from "./hooks/book-log-context";

export function App() {
  const { watched, pending, watching } = useWatchLogContext();
  const { all: books } = useBookLogContext();
  const { user, logout } = useAuth();
  const { watched: playedGames, pending: wantedGames, all: allGames } = useGameLogContext();
  const gameCount = (status: "playing" | "abandoned" | "replaying" | "platinado") =>
    allGames.filter((game) => game.status === status).length;
  const isGames = useLocation().pathname.startsWith("/games");
  const isBooks = useLocation().pathname.startsWith("/books");

  return (
    <div className={isGames ? "shell shell--games" : isBooks ? "shell shell--books" : "shell"}>
      <Sidebar
        watchedCount={watched.length}
        pendingCount={pending.length}
        watchingCount={watching.length}
        bookReadCount={books.filter((book) => book.status === "read").length}
        bookPendingCount={books.filter((book) => book.status === "pending").length}
        bookReadingCount={books.filter((book) => book.status === "reading").length}
        gameCompletedCount={playedGames.length}
        gameWantedCount={wantedGames.length}
        gamePlayingCount={gameCount("playing")}
        gameAbandonedCount={gameCount("abandoned")}
        gameReplayingCount={gameCount("replaying")}
        gamePlatinadoCount={gameCount("platinado")}
        isGames={isGames}
        isBooks={isBooks}
        userName={user.name}
        userEmail={user.email}
        onLogout={logout}
      />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
