import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { Movie, PagedMovies } from "@watchlog/shared";
import type { MovieRepository } from "../domain/movie-repository.js";
import { SearchMovies } from "./search-movies.js";

class FakeMovieRepository implements MovieRepository {
  public lastQuery: string | null = null;

  async search(query: string): Promise<PagedMovies> {
    this.lastQuery = query;
    return {
      page: 1,
      totalPages: 1,
      results: [
        {
          id: 1,
          title: "The Dark Knight",
          overview: "Batman vs Joker",
          posterPath: "/poster.jpg",
          backdropPath: null,
          releaseYear: "2008",
          voteAverage: 9,
          genres: ["Action"],
        } satisfies Movie,
      ],
    };
  }

  async findById(): Promise<Movie | null> {
    return null;
  }

  async popular(): Promise<PagedMovies> {
    return { page: 1, totalPages: 0, results: [] };
  }
}

describe("SearchMovies", () => {
  it("no llama al repositorio si la query está vacía", async () => {
    const repo = new FakeMovieRepository();
    const useCase = new SearchMovies(repo);

    const result = await useCase.execute("   ");

    assert.equal(result.results.length, 0);
    assert.equal(repo.lastQuery, null);
  });

  it("delega la búsqueda recortando espacios", async () => {
    const repo = new FakeMovieRepository();
    const useCase = new SearchMovies(repo);

    const result = await useCase.execute("  batman  ");

    assert.equal(repo.lastQuery, "batman");
    assert.equal(result.results[0]?.title, "The Dark Knight");
  });
});
