import type { Book, BookStatus } from "@watchlog/shared";

type LoggedBook = Book & { status: BookStatus };

export class LocalBookLog {
  private readonly storageKey: string;

  constructor(userId: string) {
    this.storageKey = `watchlog.${userId}.books`;
  }

  all(): LoggedBook[] {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as LoggedBook[];
    } catch {
      return [];
    }
  }

  saveAll(books: LoggedBook[]) {
    localStorage.setItem(this.storageKey, JSON.stringify(books));
  }

  byStatus(status: BookStatus) {
    return this.all().filter((book) => book.status === status);
  }
}
