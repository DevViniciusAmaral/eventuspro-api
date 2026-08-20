import { FastifyReply, FastifyRequest } from "fastify";
import { listMoviesSchema } from "../schemas/list-movies";
import { TmdbMovie, tmdbService } from "../../../lib/tmdb/services";

interface Movie {
  title: string;
  description: string;
  image: string | null;
  stars: number;
}

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p";

const getPosterUrl = (posterPath: string | null) => {
  if (!posterPath) {
    return null;
  }

  return `${TMDB_IMAGE_URL}/original${posterPath}`;
};

const convertToStars = (voteAverage: number) => {
  return Math.round(voteAverage / 2);
};

const formatMovie = (movie: TmdbMovie): Movie => {
  return {
    title: movie.title,
    description: movie.overview,
    image: getPosterUrl(movie.poster_path),
    stars: convertToStars(movie.vote_average),
  };
};

export const listMoviesController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { page } = listMoviesSchema.parse(request.query);

  const moviesResponse = await tmdbService.movies.list(page);
  const formattedMovies = moviesResponse.results.map(formatMovie);

  const data = {
    movies: formattedMovies,
    page: moviesResponse.page,
    totalPages: moviesResponse.total_pages,
  };

  reply.status(200).send({ data, message: "Filmes listados com sucesso" });
};
