import crypto from "node:crypto";
import path from "node:path";
import Database from "better-sqlite3";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

type StoredUser = AuthUser & { password_hash: string };

export class AuthStore {
  private readonly database: Database.Database;

  constructor(databasePath = path.resolve(process.cwd(), "watchlog.sqlite")) {
    this.database = new Database(databasePath);
    this.database.pragma("journal_mode = WAL");
    this.database.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL DEFAULT '',
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TEXT NOT NULL
      );
    `);
    const columns = this.database.prepare("PRAGMA table_info(users)").all() as Array<{ name: string }>;
    if (!columns.some((column) => column.name === "name")) {
      this.database.exec("ALTER TABLE users ADD COLUMN name TEXT NOT NULL DEFAULT ''");
    }
  }

  createUser(name: string, email: string, password: string): AuthUser {
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const id = crypto.randomUUID();
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");

    try {
      this.database
        .prepare("INSERT INTO users (id, email, name, password_hash) VALUES (?, ?, ?, ?)")
        .run(id, normalizedEmail, normalizedName, `${salt}:${hash}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
        throw new Error("Ya existe una cuenta con ese email.");
      }
      throw error;
    }

    return { id, email: normalizedEmail, name: normalizedName };
  }

  authenticate(email: string, password: string): AuthUser | null {
    const user = this.database
      .prepare("SELECT id, email, name, password_hash FROM users WHERE email = ?")
      .get(email.trim().toLowerCase()) as StoredUser | undefined;
    if (!user) return null;

    const [salt, storedHash] = user.password_hash.split(":");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    const matches = crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(storedHash, "hex"));
    return matches ? this.toAuthUser(user) : null;
  }

  createSession(userId: string) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
    this.database
      .prepare("INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)")
      .run(token, userId, expiresAt);
    return token;
  }

  userForSession(token: string | undefined): AuthUser | null {
    if (!token) return null;
    const row = this.database
      .prepare(`SELECT users.id, users.email, sessions.expires_at
        FROM sessions JOIN users ON users.id = sessions.user_id
        WHERE sessions.token = ?`)
      .get(token) as (AuthUser & { expires_at: string }) | undefined;
    if (!row) return null;
    if (new Date(row.expires_at) <= new Date()) {
      this.deleteSession(token);
      return null;
    }
    return this.toAuthUser(row);
  }

  private toAuthUser(user: { id: string; email: string; name: string }) {
    return {
      id: user.id,
      email: user.email,
      name: user.name || user.email.split("@")[0],
    };
  }

  deleteSession(token: string) {
    this.database.prepare("DELETE FROM sessions WHERE token = ?").run(token);
  }
}