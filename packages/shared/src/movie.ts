export type Movie = {
  id: number;
  mediaType?: "movie" | "tv";
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseYear: string | null;
  voteAverage: number;
  genres: string[];
  rating?: number;
  review?: string;
};

export type PagedMovies = {
  page: number;
  totalPages: number;
  results: Movie[];
};

export function posterUrl(
  posterPath: string | null,
  imageBaseUrl: string,
  size = "w500",
): string | null {
  if (!posterPath) {
    return null;
  }

  return `${imageBaseUrl}/${size}${posterPath}`;
}
