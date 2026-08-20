import { tmdbClient } from "../tmdb/client";
import { createTmdbMovieProvider } from "./tmdb-movie-provider";

export const movieProvider = createTmdbMovieProvider(tmdbClient);

export type {
  MovieProvider,
  RawMovie,
  ListMoviesResult,
} from "./movie-provider";
