import type { Movie, PagedMovies } from "@watchlog/shared";

const API_BASE = "/api/movies";

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("No se pudo cargar la información.");
  }
  return (await response.json()) as T;
}

export const movieApi = {
  search(query: string, page = 1) {
    const params = new URLSearchParams({ q: query, page: String(page) });
    return getJson<PagedMovies>(`${API_BASE}/search?${params}`);
  },
  popular(page = 1) {
    return getJson<PagedMovies>(`${API_BASE}/popular?page=${page}`);
  },
  details(id: number, mediaType?: Movie["mediaType"]) {
    const query = mediaType ? `?type=${mediaType}` : "";
    return getJson<Movie>(`${API_BASE}/${id}${query}`);
  },
};
