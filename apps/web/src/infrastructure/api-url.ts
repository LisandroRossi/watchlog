const configuredApiUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");

export function apiUrl(path: string) {
  return `${configuredApiUrl ?? ""}${path}`;
}
