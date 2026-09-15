import type { MovieRepository } from "../domain/movie-repository.js";

export class SearchMovies {
  constructor(private readonly movies: MovieRepository) {}

  execute(query: string, page = 1) {
    const trimmed = query.trim();
    if (!trimmed) {
      return Promise.resolve({ page: 1, totalPages: 0, results: [] });
    }

    return this.movies.search(trimmed, page);
  }
}
