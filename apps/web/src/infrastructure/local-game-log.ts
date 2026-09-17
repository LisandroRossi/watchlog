import type { Game, GameStatus } from "@watchlog/shared";

const ALL_KEY = "watchlog.games";
const WATCHED_KEY = "watchlog.games.watched";
const PENDING_KEY = "watchlog.games.pending";

export class LocalGameLog {
  list(key: string) {
    const raw = localStorage.getItem(key);
    if (!raw) return [] as Game[];
    try {
      return JSON.parse(raw) as Game[];
    } catch {
      return [] as Game[];
    }
  }

  watched() {
    return this.all().filter((game) => (game.status ?? "completed") === "completed");
  }

  pending() {
    return this.all().filter((game) => (game.status ?? "want") === "want");
  }

  all() {
    const stored = this.list(ALL_KEY);
    if (stored.length) return stored;

    const migrated = [
      ...this.list(WATCHED_KEY).map((game) => ({ ...game, status: "completed" as const })),
      ...this.list(PENDING_KEY).map((game) => ({ ...game, status: "want" as const })),
    ];
    if (migrated.length) this.saveAll(migrated);
    return migrated;
  }

  byStatus(status: GameStatus) {
    return this.all().filter((game) => (game.status ?? "want") === status);
  }

  saveAll(games: Game[]) {
    localStorage.setItem(ALL_KEY, JSON.stringify(games));
  }
}
