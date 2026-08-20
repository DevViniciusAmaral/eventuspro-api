import { FastifyReply, FastifyRequest } from "fastify";
import { listEventsUseCase } from "../use-cases/list-events";

export const listEventsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const formattedEvents = await listEventsUseCase.execute(request.query);

  reply
    .status(200)
    .send({ data: formattedEvents, message: "Eventos listados com sucesso" });
};
