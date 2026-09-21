import type { Book, Game, Movie } from "@watchlog/shared";
import { apiUrl } from "./api-url";

const TOKEN_KEY = "watchlog.auth.token";
const API_BASE = apiUrl("/api/library");

type MediaType = "movie" | "book" | "game";
type LibraryItem = (Movie | Book | Game) & { status: string };

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  if (!response.ok) throw new Error(`Biblioteca no disponible (${response.status}).`);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export const libraryApi = {
  list<T extends LibraryItem>(mediaType: MediaType) {
    return request<{ items: T[] }>(`${API_BASE}/${mediaType}`);
  },
  save(mediaType: MediaType, itemId: string | number, status: string, payload: object) {
    return request<void>(`${API_BASE}/${mediaType}/${encodeURIComponent(String(itemId))}`, {
      method: "PUT",
      body: JSON.stringify({ status, payload }),
    });
  },
  remove(mediaType: MediaType, itemId: string | number) {
    return request<void>(`${API_BASE}/${mediaType}/${encodeURIComponent(String(itemId))}`, { method: "DELETE" });
  },
};
