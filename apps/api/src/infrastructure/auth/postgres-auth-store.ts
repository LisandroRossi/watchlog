import crypto from "node:crypto";
import { Pool } from "pg";
import type { AuthUser } from "./auth-store.js";

type StoredUser = AuthUser & { password_hash: string };

const schema = `
  create table if not exists public.users (
    id text primary key,
    email text not null unique,
    name text not null default '',
    password_hash text not null,
    created_at timestamptz not null default now()
  );
  create table if not exists public.sessions (
    token text primary key,
    user_id text not null references public.users(id) on delete cascade,
    expires_at timestamptz not null
  );
`;

export class PostgresAuthStore {
  readonly pool: Pool;
  private readonly ready: Promise<void>;

  constructor(databaseUrl: string) {
    this.pool = new Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
    this.ready = this.pool.query(schema).then(() => undefined);
  }

  async createUser(name: string, email: string, password: string): Promise<AuthUser> {
    await this.ready;
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const id = crypto.randomUUID();
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");

    try {
      const result = await this.pool.query<AuthUser>(
        "insert into public.users (id, email, name, password_hash) values ($1, $2, $3, $4) returning id, email, name",
        [id, normalizedEmail, normalizedName, `${salt}:${hash}`],
      );
      return result.rows[0];
    } catch (error) {
      if (isPostgresError(error) && error.code === "23505") {
        throw new Error("Ya existe una cuenta con ese email.");
      }
      throw error;
    }
  }

  async authenticate(email: string, password: string): Promise<AuthUser | null> {
    await this.ready;
    const result = await this.pool.query<StoredUser>(
      "select id, email, name, password_hash from public.users where email = $1",
      [email.trim().toLowerCase()],
    );
    const user = result.rows[0];
    if (!user) return null;

    const [salt, storedHash] = user.password_hash.split(":");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    const matches = crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(storedHash, "hex"));
    return matches ? this.toAuthUser(user) : null;
  }

  async createSession(userId: string): Promise<string> {
    await this.ready;
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await this.pool.query(
      "insert into public.sessions (token, user_id, expires_at) values ($1, $2, $3)",
      [token, userId, expiresAt],
    );
    return token;
  }

  async userForSession(token: string | undefined): Promise<AuthUser | null> {
    if (!token) return null;
    await this.ready;
    const result = await this.pool.query<AuthUser & { expires_at: Date }>(
      `select users.id, users.email, users.name, sessions.expires_at
       from public.sessions sessions join public.users users on users.id = sessions.user_id
       where sessions.token = $1`,
      [token],
    );
    const row = result.rows[0];
    if (!row) return null;
    if (new Date(row.expires_at) <= new Date()) {
      await this.deleteSession(token);
      return null;
    }
    return this.toAuthUser(row);
  }

  async deleteSession(token: string): Promise<void> {
    await this.ready;
    await this.pool.query("delete from public.sessions where token = $1", [token]);
  }

  private toAuthUser(user: AuthUser) {
    return { id: user.id, email: user.email, name: user.name || user.email.split("@")[0] };
  }
}

function isPostgresError(error: unknown): error is { code: string } {
  return typeof error === "object" && error !== null && "code" in error;
}
