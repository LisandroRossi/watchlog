import { posterUrl, type Movie, type PagedMovies } from "@watchlog/shared";
import type { MovieRepository } from "../../domain/movie-repository.js";
import { TmdbClient, TmdbHttpError } from "./tmdb-client.js";

type TmdbMovieLike = {
  id: number;
  media_type?: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genres?: { name: string }[];
};

export class TmdbMovieRepository implements MovieRepository {
  constructor(
    private readonly client: TmdbClient,
    private readonly imageBaseUrl: string,
  ) {}

  async search(query: string, page = 1): Promise<PagedMovies> {
    const payload = await this.client.searchMovies(query, page);
    return {
      page: payload.page,
      totalPages: payload.total_pages,
      results: payload.results
        .filter((movie) => movie.media_type !== "person")
        .map((movie) => this.toMovie(movie)),
    };
  }

  async findById(id: number, mediaType: "movie" | "tv" = "movie"): Promise<Movie | null> {
    try {
      const payload = await this.client.movieDetails(id, mediaType);
      return this.toMovie({ ...payload, media_type: mediaType });
    } catch (error) {
      if (error instanceof TmdbHttpError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async popular(page = 1): Promise<PagedMovies> {
    const payload = await this.client.popularMovies(page);
    return {
      page: payload.page,
      totalPages: payload.total_pages,
      results: payload.results.map((movie) => this.toMovie(movie)),
    };
  }

  private toMovie(payload: TmdbMovieLike): Movie {
    const date = payload.release_date || payload.first_air_date || "";
    return {
      id: payload.id,
      mediaType: payload.media_type === "tv" ? "tv" : "movie",
      title: payload.title || payload.name || "Sin título",
      overview: payload.overview || "Sin descripción disponible.",
      posterPath: posterUrl(payload.poster_path ?? null, this.imageBaseUrl),
      backdropPath: posterUrl(payload.backdrop_path ?? null, this.imageBaseUrl, "w780"),
      releaseYear: date ? date.slice(0, 4) : null,
      voteAverage: Number((payload.vote_average ?? 0).toFixed(1)),
      genres: payload.genres?.map((genre) => genre.name) ?? [],
    };
  }
}
