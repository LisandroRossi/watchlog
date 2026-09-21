import { Router } from "express";
import { asyncHandler } from "./async-handler.js";
import type { RecommendationController } from "./recommendation-controller.js";

export function createRecommendationRouter(controller: RecommendationController) {
  const router = Router();
  router.post("/movies", asyncHandler(controller.moviesFromHistory));
  router.post("/games", asyncHandler(controller.gamesFromHistory));
  return router;
}
