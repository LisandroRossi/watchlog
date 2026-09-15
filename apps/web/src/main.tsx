import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { App } from "./App";
import { WatchLogProvider } from "./hooks/watch-log-context";
import { HomePage } from "./pages/HomePage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import { WatchedPage } from "./pages/WatchedPage";
import { PendingPage } from "./pages/PendingPage";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WatchLogProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/watched" element={<WatchedPage />} />
          <Route path="/pending" element={<PendingPage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </WatchLogProvider>
  </StrictMode>,
);
