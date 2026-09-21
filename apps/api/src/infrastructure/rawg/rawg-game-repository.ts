import type { Game, PagedGames } from "@watchlog/shared";
import { RawgClient, RawgHttpError } from "./rawg-client.js";

type RawgGameLike = {
  id: number;
  name?: string;
  description?: string;
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

  async recommendByGenres(genres: string[]): Promise<PagedGames> {
    const slugs = genres.map((genre) => rawgGenreSlugs[genre]).filter((slug): slug is string => Boolean(slug));
    if (!slugs.length) return { page: 1, totalPages: 0, results: [] };
    return this.toPage(await this.client.recommendedGames(slugs));
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
      description: payload.description_raw || payload.description || "Sin descripción disponible.",
      coverUrl: payload.background_image ?? null,
      backgroundUrl: payload.background_image ?? null,
      releaseYear: payload.released ? payload.released.slice(0, 4) : null,
      rating: Number((payload.rating ?? 0).toFixed(1)),
      genres: payload.genres?.map((genre) => this.translateGenre(genre.name)) ?? [],
    };
  }

  private translateGenre(genre: string): string {
    const translations: Record<string, string> = {
      Action: "Acción",
      Adventure: "Aventura",
      Arcade: "Arcade",
      "Board Games": "Juegos de mesa",
      Card: "Cartas",
      Casual: "Casual",
      Educational: "Educativo",
      Family: "Familiar",
      Fighting: "Lucha",
      Indie: "Indie",
      "Massively Multiplayer": "Multijugador masivo",
      Platformer: "Plataformas",
      Puzzle: "Rompecabezas",
      Racing: "Carreras",
      RPG: "Rol",
      Shooter: "Disparos",
      Simulation: "Simulación",
      Sports: "Deportes",
      Strategy: "Estrategia",
    };

    return translations[genre] ?? genre;
  }
}

const rawgGenreSlugs: Record<string, string> = {
  Acción: "action",
  Aventura: "adventure",
  Arcade: "arcade",
  "Juegos de mesa": "board-games",
  Casual: "casual",
  Educativo: "educational",
  Familiar: "family",
  Lucha: "fighting",
  Indie: "indie",
  "Multijugador masivo": "massively-multiplayer",
  Plataformas: "platformer",
  Rompecabezas: "puzzle",
  Carreras: "racing",
  Rol: "role-playing-games-rpg",
  Disparos: "shooter",
  Simulación: "simulation",
  Deportes: "sports",
  Estrategia: "strategy",
};
