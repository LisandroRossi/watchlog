import type { Movie, PagedMovies } from "@watchlog/shared";

export interface MovieRepository {
  search(query: string, page?: number): Promise<PagedMovies>;
  findById(id: number): Promise<Movie | null>;
  popular(page?: number): Promise<PagedMovies>;
}
