import { Router } from "express";
import type { AuthStore } from "../../infrastructure/auth/auth-store.js";
import type { AuthUser } from "../../infrastructure/auth/auth-store.js";
import { asyncHandler } from "./async-handler.js";

type AuthStoreLike = {
  createUser(name: string, email: string, password: string): AuthUser | Promise<AuthUser>;
  authenticate(email: string, password: string): AuthUser | null | Promise<AuthUser | null>;
  createSession(userId: string): string | Promise<string>;
  userForSession(token: string | undefined): AuthUser | null | Promise<AuthUser | null>;
  deleteSession(token: string): void | Promise<void>;
};

function validateCredentials(name: unknown, email: unknown, password: unknown) {
  if (typeof name !== "string" || name.trim().length < 2 || typeof email !== "string" || !email.includes("@") || typeof password !== "string" || password.length < 8) {
    return "Usá tu nombre, un email válido y una contraseña de al menos 8 caracteres.";
  }
  return null;
}

export function createAuthRouter(store: AuthStoreLike | AuthStore) {
  const router = Router();

  router.post("/register", asyncHandler(async (req, res) => {
    const { name, email, password } = req.body as { name?: unknown; email?: unknown; password?: unknown };
    const validationError = validateCredentials(name, email, password);
    if (validationError) {
      res.status(400).json({ message: validationError });
      return;
    }
    const user = await store.createUser(name as string, email as string, password as string);
    const token = await store.createSession(user.id);
    res.status(201).json({ user, token });
  }));

  router.post("/login", asyncHandler(async (req, res) => {
    const { email, password } = req.body as { email?: unknown; password?: unknown };
    const user = typeof email === "string" && typeof password === "string"
      ? await store.authenticate(email, password)
      : null;
    if (!user) {
      res.status(401).json({ message: "Email o contraseña incorrectos." });
      return;
    }
    res.json({ user, token: await store.createSession(user.id) });
  }));

  router.get("/me", asyncHandler(async (req, res) => {
    const user = await store.userForSession(req.header("authorization")?.replace(/^Bearer\s+/i, ""));
    if (!user) {
      res.status(401).json({ message: "Sesión inválida." });
      return;
    }
    res.json({ user });
  }));

  router.post("/logout", asyncHandler(async (req, res) => {
    const token = req.header("authorization")?.replace(/^Bearer\s+/i, "");
    if (token) await store.deleteSession(token);
    res.status(204).send();
  }));

  return router;
}