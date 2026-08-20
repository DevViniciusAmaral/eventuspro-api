import { tmdbClient } from "./client";

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
}

interface TmdbListMoviesResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

export const tmdbService = {
  movies: {
    list: async (page = 1) => {
      const { data } = await tmdbClient.get<TmdbListMoviesResponse>(
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

      return data;
    },
  },
};
