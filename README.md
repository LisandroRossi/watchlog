# Watchlog

Bitácora personal de entretenimiento: buscá películas en TMDB, leé la ficha y marcá las que ya viste.

Stack inicial: **React + Vite** (web responsive) y **Node + Express** (API). El móvil nativo con React Native queda para una fase siguiente.

## Qué hay hoy

- Home con películas populares y búsqueda
- Detalle (descripción, año, rating, géneros)
- Login y registro persistidos en PostgreSQL/Supabase o SQLite local
- Listas de cada usuario aisladas por cuenta
- La API key de TMDB vive solo en el servidor

## Arquitectura

Monorepo npm:

- `apps/api` — casos de uso + adaptador TMDB
- `apps/web` — UI React
- `packages/shared` — tipos `Movie` compartidos

La API no habla TMDB desde los controllers: depende de `MovieRepository`. Eso deja el dominio cerrado a cambios de proveedor (SOLID / Protected Variations).

## Setup

1. Pedí una API key en [TMDB](https://www.themoviedb.org/settings/api).
2. Copiá `.env.example` a `apps/api/.env` y pegá la clave:

```
TMDB_API_KEY=tu_clave
```

3. Instalá y levantá todo:

```bash
npm install
npm run dev
```

- Web: http://localhost:5173
- API: http://localhost:4000/api/health

En desarrollo, si no configurás `DATABASE_URL`, la base SQLite se crea automáticamente como `apps/api/watchlog.sqlite`.

### Supabase / PostgreSQL

1. Creá un proyecto en Supabase.
2. Abrí **SQL Editor** y ejecutá [`supabase/schema.sql`](supabase/schema.sql).
3. Copiá la connection string de PostgreSQL de Supabase en `apps/api/.env`:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require
```

Cuando `DATABASE_URL` existe, la API usa PostgreSQL y crea las tablas si todavía no existen. Si no existe, mantiene SQLite para desarrollo local.

La migración cubre las tablas de autenticación (`users` y `sessions`) y la biblioteca sincronizada (`library_items`). Al iniciar sesión, la aplicación sube automáticamente los registros antiguos de `localStorage` y los elimina del navegador solo después de confirmarlos en la API.

### Deploy en Render

Configurá el servicio con la raíz del repositorio como **Root Directory**:

- **Build Command:** `npm install && npm run build -w @watchlog/api`
- **Start Command:** `npm start -w @watchlog/api`

El build de la API compila primero `@watchlog/shared`, por lo que Render debe ejecutar el build antes del start. También configurá `DATABASE_URL`, `TMDB_API_KEY`, `CORS_ORIGIN` y las demás variables necesarias en Environment.

## Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | API + web |
| `npm test` | tests del caso de uso de búsqueda |
| `npm run build` | build de ambos apps |

## Próximas iteraciones

Watchlist, listas custom, backend de usuario, y app React Native reutilizando la misma API.
