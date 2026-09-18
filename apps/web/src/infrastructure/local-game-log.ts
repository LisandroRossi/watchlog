import type { Game, GameStatus } from "@watchlog/shared";

export class LocalGameLog {
  private readonly allKey: string;
  private readonly watchedKey: string;
  private readonly pendingKey: string;

  constructor(userId: string) {
    this.allKey = `watchlog.${userId}.games`;
    this.watchedKey = `watchlog.${userId}.games.watched`;
    this.pendingKey = `watchlog.${userId}.games.pending`;
    this.migrateLegacyData();
  }

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
    const stored = this.list(this.allKey);
    if (stored.length) return stored;

    const migrated = [
      ...this.list(this.watchedKey).map((game) => ({ ...game, status: "completed" as const })),
      ...this.list(this.pendingKey).map((game) => ({ ...game, status: "want" as const })),
    ];
    if (migrated.length) this.saveAll(migrated);
    return migrated;
  }

  byStatus(status: GameStatus) {
    return this.all().filter((game) => (game.status ?? "want") === status);
  }

  saveAll(games: Game[]) {
    localStorage.setItem(this.allKey, JSON.stringify(games));
  }

  private migrateLegacyData() {
    const migrationKey = "watchlog.legacy.games-migrated";
    if (!localStorage.getItem(migrationKey)) {
      if (!localStorage.getItem(this.allKey) && localStorage.getItem("watchlog.games")) {
        localStorage.setItem(this.allKey, localStorage.getItem("watchlog.games")!);
      }
      if (!localStorage.getItem(this.watchedKey) && localStorage.getItem("watchlog.games.watched")) {
        localStorage.setItem(this.watchedKey, localStorage.getItem("watchlog.games.watched")!);
      }
      if (!localStorage.getItem(this.pendingKey) && localStorage.getItem("watchlog.games.pending")) {
        localStorage.setItem(this.pendingKey, localStorage.getItem("watchlog.games.pending")!);
      }
      localStorage.removeItem("watchlog.games");
      localStorage.removeItem("watchlog.games.watched");
      localStorage.removeItem("watchlog.games.pending");
      localStorage.setItem(migrationKey, "true");
    }
  }
}
