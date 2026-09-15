import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, "../../.env") });
dotenv.config({ path: path.resolve(here, "../../../../.env") });

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  tmdbApiKey: required("TMDB_API_KEY"),
  tmdbBaseUrl: process.env.TMDB_BASE_URL ?? "https://api.themoviedb.org/3",
  tmdbImageBaseUrl:
    process.env.TMDB_IMAGE_BASE_URL ?? "https://image.tmdb.org/t/p",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};
