import { Router } from "express";
import { asyncHandler } from "./async-handler.js";
import type { MovieController } from "./movie-controller.js";

export function createMovieRouter(controller: MovieController) {
  const router = Router();
  router.get("/search", asyncHandler(controller.search));
  router.get("/popular", asyncHandler(controller.popular));
  router.get("/:id", asyncHandler(controller.details));
  return router;
}
