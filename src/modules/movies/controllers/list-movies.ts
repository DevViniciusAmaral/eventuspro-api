import { FastifyReply, FastifyRequest } from "fastify";
import { listMoviesUseCase } from "../use-cases/list-movies";

export const listMoviesController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const data = await listMoviesUseCase.execute(request.query);

  reply.status(200).send({ data, message: "Filmes listados com sucesso" });
};
