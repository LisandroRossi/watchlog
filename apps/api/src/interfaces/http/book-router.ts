import { Router } from "express";
import { asyncHandler } from "./async-handler.js";
import type { BookController } from "./book-controller.js";

export function createBookRouter(controller: BookController) {
  const router = Router();
  router.get("/recommended", asyncHandler(controller.recommended));
  router.get("/search", asyncHandler(controller.search));
  return router;
}
