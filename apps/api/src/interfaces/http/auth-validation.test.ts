import assert from "node:assert/strict";
import test from "node:test";
import { normalizeEmail, validateCredentials } from "./auth-router.js";

test("normaliza el correo electrónico antes de usarlo", () => {
  assert.equal(normalizeEmail("  USER@EXAMPLE.COM  "), "user@example.com");
});

test("normaliza y acepta correos con espacios", () => {
  assert.equal(validateCredentials("Ada", "not-an-email", "password123"), "Usá tu nombre, un email válido y una contraseña de al menos 8 caracteres.");
  assert.equal(validateCredentials("Ada", " user@example.com ", "password123"), null);
});

test("no acepta credenciales incompletas", () => {
  assert.equal(validateCredentials("Ada", "user@example.com", "short"), "Usá tu nombre, un email válido y una contraseña de al menos 8 caracteres.");
  assert.equal(validateCredentials("Ada", "user@example.com", ""), "Usá tu nombre, un email válido y una contraseña de al menos 8 caracteres.");
});
