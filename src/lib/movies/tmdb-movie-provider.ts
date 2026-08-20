import { AxiosInstance, isAxiosError } from "axios";
import { AppError } from "../../errors/app-error";
import { MovieProvider, RawMovie } from "./movie-provider";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
}

interface TmdbListMoviesResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
}

const buildPosterUrl = (posterPath: string | null): string | null => {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE_URL}${posterPath}`;
};

const toRawMovie = (movie: TmdbMovie): RawMovie => ({
  id: String(movie.id),
  title: movie.title,
  overview: movie.overview,
  posterUrl: buildPosterUrl(movie.poster_path),
  voteAverage: movie.vote_average,
});

const toAppError = (error: unknown): AppError => {
  if (isAxiosError(error)) {
    console.error("[TMDB_ERROR]", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
  } else {
    console.error("[TMDB_UNKNOWN_ERROR]", error);
  }

  return new AppError({
    message: "Erro ao buscar filmes. Tente novamente mais tarde.",
    code: "INTERNAL_SERVER_ERROR",
  });
};

export const createTmdbMovieProvider = (
  client: AxiosInstance,
): MovieProvider => ({
  listMovies: async (page: number) => {
    try {
      const { data } = await client.get<TmdbListMoviesResponse>(
        "/discover/movie",
        {
          params: {
            include_adult: false,
            include_video: false,
            language: "pt-BR",
            sort_by: "popularity.desc",
            page,
          },
        },
      );

      return {
        movies: data.results.map(toRawMovie),
        page: data.page,
        totalPages: data.total_pages,
        totalPerPage: data.results.length,
      };
    } catch (error) {
      throw toAppError(error);
    }
  },
});
