import type { PagedBooks } from "@watchlog/shared";
import { apiUrl } from "./api-url";

const API_BASE = apiUrl("/api/books");

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("No se pudo cargar la información de libros.");
  return (await response.json()) as T;
}

export const bookApi = {
  search(query: string, page = 1) {
    const params = new URLSearchParams({ q: query, page: String(page) });
    return getJson<PagedBooks>(`${API_BASE}/search?${params}`);
  },
};
