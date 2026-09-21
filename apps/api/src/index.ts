import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { GetMovieDetails } from "./application/get-movie-details.js";
import { ListPopularMovies } from "./application/list-popular-movies.js";
import { SearchMovies } from "./application/search-movies.js";
import { TmdbClient } from "./infrastructure/tmdb/tmdb-client.js";
import { TmdbMovieRepository } from "./infrastructure/tmdb/tmdb-movie-repository.js";
import { errorHandler } from "./interfaces/http/error-handler.js";
import { MovieController } from "./interfaces/http/movie-controller.js";
import { createMovieRouter } from "./interfaces/http/movie-router.js";
import { RawgClient } from "./infrastructure/rawg/rawg-client.js";
import { RawgGameRepository } from "./infrastructure/rawg/rawg-game-repository.js";
import { GameController } from "./interfaces/http/game-controller.js";
import { createGameRouter } from "./interfaces/http/game-router.js";
import { AuthStore } from "./infrastructure/auth/auth-store.js";
import { createAuthRouter } from "./interfaces/http/auth-router.js";
import { OpenLibraryClient } from "./infrastructure/openlibrary-client.js";
import { BookController } from "./interfaces/http/book-controller.js";
import { createBookRouter } from "./interfaces/http/book-router.js";

const tmdb = new TmdbClient(env.tmdbBaseUrl, env.tmdbApiKey);
const movies = new TmdbMovieRepository(tmdb, env.tmdbImageBaseUrl);
const games = new RawgGameRepository(new RawgClient(env.rawgBaseUrl, env.rawgApiKey));

const controller = new MovieController(
  new SearchMovies(movies),
  new GetMovieDetails(movies),
  new ListPopularMovies(movies),
);

const app = express();
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "watchlog-api" });
});
app.use("/api/movies", createMovieRouter(controller));
app.use("/api/games", createGameRouter(new GameController(games)));
app.use("/api/auth", createAuthRouter(new AuthStore()));
app.use("/api/books", createBookRouter(new BookController(new OpenLibraryClient())));
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Watchlog API en http://localhost:${env.port}`);
});
