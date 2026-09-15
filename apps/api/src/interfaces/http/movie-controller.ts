import type { Request, Response } from "express";
import type { GetMovieDetails } from "../../application/get-movie-details.js";
import type { ListPopularMovies } from "../../application/list-popular-movies.js";
import type { SearchMovies } from "../../application/search-movies.js";

export class MovieController {
  constructor(
    private readonly searchMovies: SearchMovies,
    private readonly getMovieDetails: GetMovieDetails,
    private readonly listPopularMovies: ListPopularMovies,
  ) {}

  search = async (request: Request, response: Response) => {
    const query = String(request.query.q ?? "");
    const page = Number(request.query.page ?? 1);
    const result = await this.searchMovies.execute(query, page);
    response.json(result);
  };

  popular = async (_request: Request, response: Response) => {
    const page = Number(_request.query.page ?? 1);
    const result = await this.listPopularMovies.execute(page);
    response.json(result);
  };

  details = async (request: Request, response: Response) => {
    const id = Number(request.params.id);
    if (!Number.isInteger(id)) {
      response.status(400).json({ error: "Id inválido." });
      return;
    }

    const movie = await this.getMovieDetails.execute(id);
    if (!movie) {
      response.status(404).json({ error: "Película no encontrada." });
      return;
    }

    response.json(movie);
  };
}
