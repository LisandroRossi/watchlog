import type { Request, Response } from "express";
import type { OpenLibraryClient } from "../../infrastructure/openlibrary-client.js";

export class BookController {
  constructor(private readonly client: OpenLibraryClient) {}

  private toPage(payload: Awaited<ReturnType<OpenLibraryClient["search"]>>, page: number) {
    const results = (payload.docs ?? [])
      .filter((book) => book.key && book.title)
      .map((book) => ({
        id: book.key!.replace("/works/", ""),
        title: book.title!,
        authors: book.author_name ?? [],
        firstPublishYear: book.first_publish_year ?? null,
        coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
        pageCount: book.number_of_pages_median ?? null,
      }));

    return {
      page,
      totalPages: Math.max(1, Math.ceil((payload.numFound ?? 0) / 24)),
      results,
    };
  }

  search = async (request: Request, response: Response) => {
    const query = String(request.query.q ?? "").trim();
    const page = Math.max(1, Number(request.query.page ?? 1));
    if (!query) {
      response.json({ page, totalPages: 0, results: [] });
      return;
    }

    const payload = await this.client.search(query, page);
    response.json(this.toPage(payload, page));
  };

  recommended = async (_request: Request, response: Response) => {
    const payload = await this.client.search("subject:fiction", 1);
    response.json(this.toPage(payload, 1));
  };
}
