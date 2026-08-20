import { FastifyInstance } from "fastify";
import { listMoviesController } from "./controllers/list-movies";

export const movieRouter = (app: FastifyInstance) => {
  app.get("/", listMoviesController);
};
