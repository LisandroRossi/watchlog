import type { PagedGames, PagedMovies } from "@watchlog/shared";
import { apiUrl } from "./api-url";

async function request<T>(path: string, genres: string[]) {
  const response = await fetch(apiUrl(`/api/recommendations/${path}`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ genres }),
  });
  if (!response.ok) throw new Error("No se pudieron cargar las recomendaciones.");
  return (await response.json()) as T & { preferredGenres: string[] };
}

export const recommendationApi = {
  movies: (genres: string[]) => request<PagedMovies>("movies", genres),
  games: (genres: string[]) => request<PagedGames>("games", genres),
};
