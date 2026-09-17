import { Router } from "express";
import { asyncHandler } from "./async-handler.js";
import type { GameController } from "./game-controller.js";

export function createGameRouter(controller: GameController) {
  const router = Router();
  router.get("/search", asyncHandler(controller.search));
  router.get("/popular", asyncHandler(controller.popular));
  router.get("/:id", asyncHandler(controller.details));
  return router;
}
