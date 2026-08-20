export interface RawMovie {
  id: string;
  title: string;
  overview: string;
  posterUrl: string | null;
  voteAverage: number;
}

export interface ListMoviesResult {
  movies: RawMovie[];
  page: number;
  totalPages: number;
  totalPerPage: number;
}

export interface MovieProvider {
  listMovies: (page: number) => Promise<ListMoviesResult>;
}
