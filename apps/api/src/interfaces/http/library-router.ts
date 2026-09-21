import { Router } from "express";
import type { AuthUser } from "../../infrastructure/auth/auth-store.js";
import type { LibraryMediaType, LibraryStore } from "../../infrastructure/library-store.js";
import { asyncHandler } from "./async-handler.js";

type SessionStore = { userForSession(token: string | undefined): AuthUser | null | Promise<AuthUser | null> };
const mediaTypes = new Set<LibraryMediaType>(["movie", "book", "game"]);

export function createLibraryRouter(library: LibraryStore, sessions: SessionStore) {
  const router = Router();
  router.use(asyncHandler(async (request, response, next) => {
    const token = request.header("authorization")?.replace(/^Bearer\s+/i, "");
    const user = await sessions.userForSession(token);
    if (!user) {
      response.status(401).json({ message: "Sesión inválida." });
      return;
    }
    response.locals.user = user;
    next();
  }));

  router.get("/:mediaType", asyncHandler(async (request, response) => {
    const mediaType = request.params.mediaType as LibraryMediaType;
    if (!mediaTypes.has(mediaType)) {
      response.status(400).json({ message: "Tipo de biblioteca inválido." });
      return;
    }
    response.json({ items: await library.list(response.locals.user.id, mediaType) });
  }));

  router.put("/:mediaType/:itemId", asyncHandler(async (request, response) => {
    const mediaType = request.params.mediaType as LibraryMediaType;
    if (!mediaTypes.has(mediaType) || typeof request.body?.status !== "string" || typeof request.body?.payload !== "object") {
      response.status(400).json({ message: "Elemento de biblioteca inválido." });
      return;
    }
    await library.save(response.locals.user.id, mediaType, request.params.itemId, request.body.status, request.body.payload);
    response.status(204).send();
  }));

  router.delete("/:mediaType/:itemId", asyncHandler(async (request, response) => {
    const mediaType = request.params.mediaType as LibraryMediaType;
    if (!mediaTypes.has(mediaType)) {
      response.status(400).json({ message: "Tipo de biblioteca inválido." });
      return;
    }
    await library.remove(response.locals.user.id, mediaType, request.params.itemId);
    response.status(204).send();
  }));

  return router;
}