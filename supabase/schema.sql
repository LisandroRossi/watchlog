-- Watchlog auth schema for Supabase/PostgreSQL.
-- Run this file in Supabase SQL Editor before deploying the API.

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

create index if not exists sessions_user_id_idx on public.sessions(user_id);
create index if not exists sessions_expires_at_idx on public.sessions(expires_at);

create table if not exists public.library_items (
  user_id text not null references public.users(id) on delete cascade,
  media_type text not null check (media_type in ('movie', 'book', 'game')),
  item_id text not null,
  status text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, media_type, item_id)
);

create index if not exists library_items_user_type_idx on public.library_items(user_id, media_type);

-- Optional cleanup for expired custom sessions.
delete from public.sessions where expires_at <= now();
