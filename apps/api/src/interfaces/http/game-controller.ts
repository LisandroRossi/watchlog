import type { Request, Response } from "express";
import type { RawgGameRepository } from "../../infrastructure/rawg/rawg-game-repository.js";

export class GameController {
  constructor(private readonly games: RawgGameRepository) {}

  search = async (request: Request, response: Response) => {
    const query = String(request.query.q ?? "").trim();
    const page = Number(request.query.page ?? 1);
    response.json(query ? await this.games.search(query, page) : { page: 1, totalPages: 0, results: [] });
  };

  popular = async (request: Request, response: Response) => {
    const page = Number(request.query.page ?? 1);
    response.json(await this.games.popular(page));
  };

  details = async (request: Request, response: Response) => {
    const id = Number(request.params.id);
    if (!Number.isInteger(id)) {
      response.status(400).json({ error: "Id inválido." });
      return;
    }

    const game = await this.games.findById(id);
    if (!game) {
      response.status(404).json({ error: "Videojuego no encontrado." });
      return;
    }
    response.json(game);
  };
}
