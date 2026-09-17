import type { MovieRepository } from "../domain/movie-repository.js";

export class GetMovieDetails {
  constructor(private readonly movies: MovieRepository) {}

  execute(id: number, mediaType: "movie" | "tv" = "movie") {
    return this.movies.findById(id, mediaType);
  }
}
