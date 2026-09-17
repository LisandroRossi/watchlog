type RawgGamePayload = {
  id: number;
  name?: string;
  description_raw?: string;
  background_image?: string | null;
  released?: string | null;
  rating?: number;
  genres?: { name: string }[];
};

type RawgPagedPayload = {
  page: number;
  count: number;
  results: RawgGamePayload[];
};

export class RawgHttpError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "RawgHttpError";
  }
}

export class RawgClient {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
  ) {}

  searchGames(query: string, page: number) {
    return this.get<RawgPagedPayload>("/games", {
      search: query,
      page: String(page),
      page_size: "20",
    });
  }

  popularGames(page: number) {
    return this.get<RawgPagedPayload>("/games", {
      ordering: "-rating",
      page: String(page),
      page_size: "20",
    });
  }

  gameDetails(id: number) {
    return this.get<RawgGamePayload>(`/games/${id}`, {});
  }

  private async get<T>(pathname: string, params: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${pathname}`);
    url.searchParams.set("key", this.apiKey);
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new RawgHttpError(`RAWG respondió ${response.status} en ${pathname}`, response.status);
    }

    return (await response.json()) as T;
  }
}
