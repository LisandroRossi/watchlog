import type { Movie } from "@watchlog/shared";

const STORAGE_KEY = "watchlog.watched";
const PENDING_STORAGE_KEY = "watchlog.pending";

export class LocalWatchLog {
  list(): Movie[] {
    const raw = localStorage.getItem(STORAGE_KEY);
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
    this.save([movie, ...this.list()]);
  }

  remove(id: number) {
    this.save(this.list().filter((movie) => movie.id !== id));
  }

  listPending(): Movie[] {
    const raw = localStorage.getItem(PENDING_STORAGE_KEY);
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

  private save(movies: Movie[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  }

  private savePending(movies: Movie[]) {
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(movies));
  }
}
