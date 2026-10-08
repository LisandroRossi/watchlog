import { Router } from "express";
import type { AuthStore } from "../../infrastructure/auth/auth-store.js";
import type { AuthUser } from "../../infrastructure/auth/auth-store.js";
import { asyncHandler } from "./async-handler.js";
import { clearSessionCookie, setSessionCookie, sessionTokenFromRequest } from "./session-token.js";

type AuthStoreLike = {
  createUser(name: string, email: string, password: string): AuthUser | Promise<AuthUser>;
  authenticate(email: string, password: string): AuthUser | null | Promise<AuthUser | null>;
  createSession(userId: string): string | Promise<string>;
  userForSession(token: string | undefined): AuthUser | null | Promise<AuthUser | null>;
  deleteSession(token: string): void | Promise<void>;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validateCredentials(name: unknown, email: unknown, password: unknown) {
  const validName = typeof name === "string" && name.trim().length >= 2;
  const validEmail = typeof email === "string" && emailPattern.test(normalizeEmail(email));
  const validPassword = typeof password === "string" && password.length >= 8;
  if (!validName || !validEmail || !validPassword) {
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
    const user = await store.createUser(name as string, normalizeEmail(email as string), password as string);
    const token = await store.createSession(user.id);
    setSessionCookie(res, token);
    res.status(201).json({ user, token });
  }));

  router.post("/login", asyncHandler(async (req, res) => {
    const { email, password } = req.body as { email?: unknown; password?: unknown };
    const user = typeof email === "string" && typeof password === "string"
      ? await store.authenticate(normalizeEmail(email), password)
      : null;
    if (!user) {
      res.status(401).json({ message: "Email o contraseña incorrectos." });
      return;
    }
    const token = await store.createSession(user.id);
    setSessionCookie(res, token);
    res.json({ user, token });
  }));

  router.get("/me", asyncHandler(async (req, res) => {
    const token = sessionTokenFromRequest(req);
    const user = token ? await store.userForSession(token) : null;
    if (!user) {
      res.status(401).json({ message: "Sesión inválida." });
      return;
    }
    res.json({ user });
  }));

  router.post("/logout", asyncHandler(async (req, res) => {
    const token = sessionTokenFromRequest(req);
    if (token) await store.deleteSession(token);
    clearSessionCookie(res);
    res.status(204).send();
  }));

  return router;
}