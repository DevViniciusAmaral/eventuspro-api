import { listMoviesSchema } from "../schemas/list-movies";
import { movieProvider } from "../../../lib/movies";

interface FormattedMovie {
  title: string;
  description: string;
  image: string | null;
  stars: number;
}

const convertToStars = (voteAverage: number): number => {
  return Math.round(voteAverage / 2);
};

export const listMoviesUseCase = {
  execute: async (query: unknown) => {
    const { page } = listMoviesSchema.parse(query);

    const result = await movieProvider.listMovies(page);

    const movies: FormattedMovie[] = result.movies.map((movie) => ({
      title: movie.title,
      description: movie.overview,
      image: movie.posterUrl,
      stars: convertToStars(movie.voteAverage),
    }));

    return {
      movies,
      page: result.page,
      totalPages: result.totalPages,
      totalPerPage: result.totalPerPage,
    };
  },
};
