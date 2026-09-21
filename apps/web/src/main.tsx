import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { App } from "./App";
import { HomePage } from "./pages/HomePage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { WatchedPage } from "./pages/WatchedPage";
import { PendingPage } from "./pages/PendingPage";
import { WatchingPage } from "./pages/WatchingPage";
import { BooksPage } from "./pages/BooksPage";
import { BookStatusPage } from "./pages/BookStatusPage";
import { GamesPage } from "./pages/GamesPage";
import { GameDetailPage } from "./pages/GameDetailPage";
import { GameStatusPage } from "./pages/GameStatusPage";
import { GameStatsPage } from "./pages/GameStatsPage";
import { MovieStatsPage } from "./pages/MovieStatsPage";
import { AuthProvider, useAuth } from "./hooks/auth-context";
import { WatchLogProvider } from "./hooks/watch-log-context";
import { GameLogProvider } from "./hooks/game-log-context";
import { BookLogProvider } from "./hooks/book-log-context";
import { LoginPage } from "./pages/LoginPage";
import "./styles.css";

function ProtectedRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <main className="auth-page"><p>Comprobando sesión...</p></main>;
  if (!user) return <Navigate to="/login" replace />;
  return <WatchLogProvider><GameLogProvider><BookLogProvider><Routes><Route element={<App />}><Route path="/" element={<HomePage />} /><Route path="/watched" element={<WatchedPage />} /><Route path="/pending" element={<PendingPage />} /><Route path="/watching" element={<WatchingPage />} /><Route path="/stats" element={<MovieStatsPage />} /><Route path="/movie/:id" element={<MovieDetailPage />} /><Route path="/games" element={<GamesPage />} /><Route path="/games/stats" element={<GameStatsPage />} /><Route path="/games/want" element={<GameStatusPage status="want" />} /><Route path="/games/playing" element={<GameStatusPage status="playing" />} /><Route path="/games/completed" element={<GameStatusPage status="completed" />} /><Route path="/games/abandoned" element={<GameStatusPage status="abandoned" />} /><Route path="/games/replaying" element={<GameStatusPage status="replaying" />} /><Route path="/games/platinado" element={<GameStatusPage status="platinado" />} /><Route path="/games/:id" element={<GameDetailPage />} /><Route path="/books" element={<BooksPage />} /><Route path="/books/read" element={<BookStatusPage status="read" />} /><Route path="/books/pending" element={<BookStatusPage status="pending" />} /><Route path="/books/reading" element={<BookStatusPage status="reading" />} /></Route></Routes></BookLogProvider></GameLogProvider></WatchLogProvider>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<ProtectedRoutes />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
