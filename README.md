# Watchlog

Bitácora personal de entretenimiento: buscá películas en TMDB, leé la ficha y marcá las que ya viste.

Stack inicial: **React + Vite** (web responsive) y **Node + Express** (API). El móvil nativo con React Native queda para una fase siguiente.

## Qué hay hoy

- Home con películas populares y búsqueda
- Detalle (descripción, año, rating, géneros)
- Lista de vistas persistida en `localStorage`
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

## Scripts

| Script | Qué hace |
| --- | --- |
| `npm run dev` | API + web |
| `npm test` | tests del caso de uso de búsqueda |
| `npm run build` | build de ambos apps |

## Próximas iteraciones

Watchlist, listas custom, backend de usuario, y app React Native reutilizando la misma API.
