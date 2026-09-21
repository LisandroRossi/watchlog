import type { Request, Response } from "express";
import type { RawgGameRepository } from "../../infrastructure/rawg/rawg-game-repository.js";
import type { TmdbMovieRepository } from "../../infrastructure/tmdb/tmdb-movie-repository.js";

type RecommendationBody = { genres?: unknown };

export class RecommendationController {
  constructor(
    private readonly movies: TmdbMovieRepository,
    private readonly games: RawgGameRepository,
  ) {}

  moviesFromHistory = async (request: Request, response: Response) => {
    const genres = this.readGenres(request.body as RecommendationBody);
    const preferredGenres = this.rankGenres(genres);
    const recommendations = await this.movies.recommendByGenres(preferredGenres);
    response.json({ preferredGenres, ...recommendations });
  };

  gamesFromHistory = async (request: Request, response: Response) => {
    const genres = this.readGenres(request.body as RecommendationBody);
    const preferredGenres = this.rankGenres(genres);
    const recommendations = await this.games.recommendByGenres(preferredGenres);
    response.json({ preferredGenres, ...recommendations });
  };

  private readGenres(body: RecommendationBody) {
    return Array.isArray(body?.genres)
      ? body.genres.filter((genre): genre is string => typeof genre === "string").slice(0, 100)
      : [];
  }

  private rankGenres(genres: string[]) {
    const counts = new Map<string, number>();
    genres.forEach((genre) => {
      const normalized = genre.trim();
      if (normalized) counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
    });
    return [...counts.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .slice(0, 3)
      .map(([genre]) => genre);
  }
}
