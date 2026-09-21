import type { Movie } from "@watchlog/shared";

export class LocalWatchLog {
  private readonly storageKey: string;
  private readonly pendingStorageKey: string;
  private readonly watchingStorageKey: string;

  constructor(userId: string) {
    this.storageKey = `watchlog.${userId}.watched`;
    this.pendingStorageKey = `watchlog.${userId}.pending`;
    this.watchingStorageKey = `watchlog.${userId}.watching`;
    this.migrateLegacyData();
  }

  list(): Movie[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as Movie[];
    } catch {
      return [];
    }
  }

  has(id: number) {
    return this.list().some((movie) => movie.id === id);
  }

  add(movie: Movie) {
    if (this.has(movie.id)) {
      return;
    }
    this.save([{ ...movie, rating: undefined, review: undefined }, ...this.list()]);
  }

  update(id: number, updates: Partial<Pick<Movie, "rating" | "review">>) {
    const items = this.list();
    const index = items.findIndex((movie) => movie.id === id);

    if (index === -1) {
      return;
    }

    const nextItems = [...items];
    nextItems[index] = { ...nextItems[index], ...updates };
    this.save(nextItems);
  }

  remove(id: number) {
    this.save(this.list().filter((movie) => movie.id !== id));
  }

  listPending(): Movie[] {
    const raw = localStorage.getItem(this.pendingStorageKey);
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as Movie[];
    } catch {
      return [];
    }
  }

  addPending(movie: Movie) {
    if (this.listPending().some((pendingMovie) => pendingMovie.id === movie.id)) {
      return;
    }
    this.savePending([movie, ...this.listPending()]);
  }

  removePending(id: number) {
    this.savePending(this.listPending().filter((movie) => movie.id !== id));
  }

  listWatching(): Movie[] {
    const raw = localStorage.getItem(this.watchingStorageKey);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as Movie[];
    } catch {
      return [];
    }
  }

  addWatching(movie: Movie) {
    if (this.listWatching().some((watchingMovie) => watchingMovie.id === movie.id)) return;
    this.saveWatching([movie, ...this.listWatching()]);
  }

  removeWatching(id: number) {
    this.saveWatching(this.listWatching().filter((movie) => movie.id !== id));
  }

  private save(movies: Movie[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(movies));
  }

  private savePending(movies: Movie[]) {
    localStorage.setItem(this.pendingStorageKey, JSON.stringify(movies));
  }

  private saveWatching(movies: Movie[]) {
    localStorage.setItem(this.watchingStorageKey, JSON.stringify(movies));
  }

  private migrateLegacyData() {
    const migrationKey = "watchlog.legacy.movies-migrated";
    if (!localStorage.getItem(migrationKey)) {
      if (!localStorage.getItem(this.storageKey) && localStorage.getItem("watchlog.watched")) {
        localStorage.setItem(this.storageKey, localStorage.getItem("watchlog.watched")!);
      }
      if (!localStorage.getItem(this.pendingStorageKey) && localStorage.getItem("watchlog.pending")) {
        localStorage.setItem(this.pendingStorageKey, localStorage.getItem("watchlog.pending")!);
      }
      localStorage.removeItem("watchlog.watched");
      localStorage.removeItem("watchlog.pending");
      localStorage.setItem(migrationKey, "true");
    }
  }
}
