import type { Game, PagedGames } from "@watchlog/shared";

const API_BASE = "/api/games";

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("No se pudo cargar la información.");
  return (await response.json()) as T;
}

export const gameApi = {
  search(query: string, page = 1) {
    const params = new URLSearchParams({ q: query, page: String(page) });
    return getJson<PagedGames>(`${API_BASE}/search?${params}`);
  },
  popular(page = 1) {
    return getJson<PagedGames>(`${API_BASE}/popular?page=${page}`);
  },
  details(id: number) {
    return getJson<Game>(`${API_BASE}/${id}`);
  },
};
