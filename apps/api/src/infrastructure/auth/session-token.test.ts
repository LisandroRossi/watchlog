import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import Database from "better-sqlite3";
import { AuthStore } from "./auth-store.js";

test("almacena únicamente el hash de una sesión y la recupera con el token original", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "watchlog-session-"));
  const databasePath = path.join(directory, "watchlog.sqlite");
  const store = new AuthStore(databasePath);
  const user = store.createUser("Ada", "ada@example.com", "password123");
  const token = store.createSession(user.id);
  const database = new Database(databasePath);
  const stored = database.prepare("SELECT token_hash FROM sessions").get() as { token_hash: string };

  assert.notEqual(stored.token_hash, token);
  assert.equal(store.userForSession(token)?.id, user.id);
  assert.equal(store.userForSession("not-the-session")?.id, undefined);
  database.close();
  store.close();
  rmSync(directory, { recursive: true, force: true });
});
