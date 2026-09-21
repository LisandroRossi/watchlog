export type Book = {
  id: string;
  title: string;
  authors: string[];
  firstPublishYear: number | null;
  coverUrl: string | null;
  pageCount: number | null;
  currentPage?: number;
};

export type BookStatus = "read" | "pending" | "reading";

export type PagedBooks = {
  page: number;
  totalPages: number;
  results: Book[];
};
