import { Pool } from "pg";

export type LibraryMediaType = "movie" | "book" | "game";

const schema = `
  create table if not exists public.library_items (
    user_id text not null references public.users(id) on delete cascade,
    media_type text not null check (media_type in ('movie', 'book', 'game')),
    item_id text not null,
    status text not null,
    payload jsonb not null,
    updated_at timestamptz not null default now(),
    primary key (user_id, media_type, item_id)
  );
`;

export class LibraryStore {
  private readonly ready: Promise<void>;

  constructor(private readonly pool: Pool) {
    this.ready = this.pool.query(schema).then(() => undefined);
  }

  async list(userId: string, mediaType: LibraryMediaType) {
    await this.ready;
    const result = await this.pool.query<{ item_id: string; status: string; payload: unknown }>(
      "select item_id, status, payload from public.library_items where user_id = $1 and media_type = $2 order by updated_at desc",
      [userId, mediaType],
    );
    return result.rows.map((row) => ({ ...asObject(row.payload), id: coerceId(row.item_id), status: row.status }));
  }

  async save(userId: string, mediaType: LibraryMediaType, itemId: string, status: string, payload: Record<string, unknown>) {
    await this.ready;
    await this.pool.query(
      `insert into public.library_items (user_id, media_type, item_id, status, payload, updated_at)
       values ($1, $2, $3, $4, $5::jsonb, now())
       on conflict (user_id, media_type, item_id)
       do update set status = excluded.status, payload = excluded.payload, updated_at = now()`,
      [userId, mediaType, itemId, status, JSON.stringify(payload)],
    );
  }

  async remove(userId: string, mediaType: LibraryMediaType, itemId: string) {
    await this.ready;
    await this.pool.query(
      "delete from public.library_items where user_id = $1 and media_type = $2 and item_id = $3",
      [userId, mediaType, itemId],
    );
  }
}

function asObject(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : {};
}

function coerceId(value: string): string | number {
  return /^\d+$/.test(value) ? Number(value) : value;
}