import type { NextFunction, Request, Response } from "express";
import { TmdbHttpError } from "../../infrastructure/tmdb/tmdb-client.js";
import { RawgHttpError } from "../../infrastructure/rawg/rawg-client.js";

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof TmdbHttpError) {
    response.status(502).json({ error: "No se pudo consultar TMDB." });
    return;
  }

  if (error instanceof RawgHttpError) {
    response.status(502).json({ error: "No se pudo consultar RAWG. Verificá la API key." });
    return;
  }

  console.error(error);
  response.status(500).json({ error: "Error interno del servidor." });
}
