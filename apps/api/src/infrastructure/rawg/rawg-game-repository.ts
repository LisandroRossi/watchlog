import type { Game, PagedGames } from "@watchlog/shared";
import { RawgClient, RawgHttpError } from "./rawg-client.js";

type RawgGameLike = {
  id: number;
  name?: string;
  description_raw?: string;
  background_image?: string | null;
  released?: string | null;
  rating?: number;
  genres?: { name: string }[];
};

export class RawgGameRepository {
  constructor(private readonly client: RawgClient) {}

  async search(query: string, page = 1): Promise<PagedGames> {
    const payload = await this.client.searchGames(query, page);
    return this.toPage(payload);
  }

  async popular(page = 1): Promise<PagedGames> {
    const payload = await this.client.popularGames(page);
    return this.toPage(payload);
  }

  async findById(id: number): Promise<Game | null> {
    try {
      return this.toGame(await this.client.gameDetails(id));
    } catch (error) {
      if (error instanceof RawgHttpError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  private toPage(payload: { page: number; count: number; results: RawgGameLike[] }): PagedGames {
    return {
      page: payload.page,
      totalPages: Math.ceil(payload.count / 20),
      results: payload.results.map((game) => this.toGame(game)),
    };
  }

  private toGame(payload: RawgGameLike): Game {
    return {
      id: payload.id,
      title: payload.name || "Sin título",
      description: payload.description_raw || "Sin descripción disponible.",
      coverUrl: payload.background_image ?? null,
      backgroundUrl: payload.background_image ?? null,
      releaseYear: payload.released ? payload.released.slice(0, 4) : null,
      rating: Number((payload.rating ?? 0).toFixed(1)),
      genres: payload.genres?.map((genre) => genre.name) ?? [],
    };
  }
}
