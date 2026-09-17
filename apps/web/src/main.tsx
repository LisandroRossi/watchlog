import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "./App";
import { WatchLogProvider } from "./hooks/watch-log-context";
import { HomePage } from "./pages/HomePage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { WatchedPage } from "./pages/WatchedPage";
import { PendingPage } from "./pages/PendingPage";
import { GamesPage } from "./pages/GamesPage";
import { GameDetailPage } from "./pages/GameDetailPage";
import { GameStatusPage } from "./pages/GameStatusPage";
import { GameLogProvider } from "./hooks/game-log-context";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WatchLogProvider>
    <GameLogProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/watched" element={<WatchedPage />} />
          <Route path="/pending" element={<PendingPage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/games/want" element={<GameStatusPage status="want" />} />
          <Route path="/games/playing" element={<GameStatusPage status="playing" />} />
          <Route path="/games/completed" element={<GameStatusPage status="completed" />} />
          <Route path="/games/abandoned" element={<GameStatusPage status="abandoned" />} />
          <Route path="/games/replaying" element={<GameStatusPage status="replaying" />} />
          <Route path="/games/:id" element={<GameDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </GameLogProvider>
    </WatchLogProvider>
  </StrictMode>,
);
