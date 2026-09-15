import type { MovieRepository } from "../domain/movie-repository.js";

export class ListPopularMovies {
  constructor(private readonly movies: MovieRepository) {}

  execute(page = 1) {
    return this.movies.popular(page);
  }
}
