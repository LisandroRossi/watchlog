import { Router } from "express";
import type { AuthStore } from "../../infrastructure/auth/auth-store.js";

function validateCredentials(name: unknown, email: unknown, password: unknown) {
  if (typeof name !== "string" || name.trim().length < 2 || typeof email !== "string" || !email.includes("@") || typeof password !== "string" || password.length < 8) {
    return "Usá tu nombre, un email válido y una contraseña de al menos 8 caracteres.";
  }
  return null;
}

export function createAuthRouter(store: AuthStore) {
  const router = Router();

  router.post("/register", (req, res, next) => {
    try {
      const { name, email, password } = req.body as { name?: unknown; email?: unknown; password?: unknown };
      const validationError = validateCredentials(name, email, password);
      if (validationError) return res.status(400).json({ message: validationError });
      const user = store.createUser(name as string, email as string, password as string);
      const token = store.createSession(user.id);
      return res.status(201).json({ user, token });
    } catch (error) {
      return next(error);
    }
  });

  router.post("/login", (req, res) => {
    const { email, password } = req.body as { email?: unknown; password?: unknown };
    const user = typeof email === "string" && typeof password === "string"
      ? store.authenticate(email, password)
      : null;
    if (!user) return res.status(401).json({ message: "Email o contraseña incorrectos." });
    return res.json({ user, token: store.createSession(user.id) });
  });

  router.get("/me", (req, res) => {
    const user = store.userForSession(req.header("authorization")?.replace(/^Bearer\s+/i, ""));
    if (!user) return res.status(401).json({ message: "Sesión inválida." });
    return res.json({ user });
  });

  router.post("/logout", (req, res) => {
    const token = req.header("authorization")?.replace(/^Bearer\s+/i, "");
    if (token) store.deleteSession(token);
    return res.status(204).send();
  });

  return router;
}