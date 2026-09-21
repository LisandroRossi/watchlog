type OpenLibraryDoc = {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  number_of_pages_median?: number;
};

type OpenLibrarySearchPayload = {
  numFound?: number;
  start?: number;
  docs?: OpenLibraryDoc[];
};

export class OpenLibraryClient {
  constructor(private readonly baseUrl = "https://openlibrary.org") {}

  async search(query: string, page: number) {
    const url = new URL("/search.json", this.baseUrl);
    url.searchParams.set("q", query);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", "24");
    url.searchParams.set("fields", "key,title,author_name,first_publish_year,cover_i,number_of_pages_median");

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OpenLibrary respondió ${response.status}.`);
    }

    return (await response.json()) as OpenLibrarySearchPayload;
  }
}
