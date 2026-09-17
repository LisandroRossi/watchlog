export type GameStatus = "want" | "playing" | "completed" | "abandoned" | "replaying";

export type Game = {
  id: number;
  title: string;
  description: string;
  coverUrl: string | null;
  backgroundUrl: string | null;
  releaseYear: string | null;
  rating: number;
  genres: string[];
  status?: GameStatus;
  userRating?: number;
  review?: string;
};

export type PagedGames = {
  page: number;
  totalPages: number;
  results: Game[];
};
