type TmdbMoviePayload = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genres?: { id: number; name: string }[];
  genre_ids?: number[];
};

type TmdbPagedPayload = {
  page: number;
  total_pages: number;
  results: TmdbMoviePayload[];
};

export class TmdbHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "TmdbHttpError";
  }
}

export class TmdbClient {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {}

  searchMovies(query: string, page: number) {
    return this.get<TmdbPagedPayload>("/search/movie", { query, page: String(page) });
  }

  movieDetails(id: number) {
    return this.get<TmdbMoviePayload>(`/movie/${id}`, { language: "es-ES" });
  }

  popularMovies(page: number) {
    return this.get<TmdbPagedPayload>("/movie/popular", {
      page: String(page),
      language: "es-ES",
    });
  }

  private async get<T>(pathname: string, params: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${pathname}`);
    url.searchParams.set("api_key", this.apiKey);
    url.searchParams.set("language", params.language ?? "es-ES");
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new TmdbHttpError(
        `TMDB respondió ${response.status} en ${pathname}`,
        response.status,
      );
    }

    return (await response.json()) as T;
  }
}
