import { FastifyReply, FastifyRequest } from "fastify";
import { findEventByIdUseCase } from "../use-cases/find-event-by-id";

export const findEventByIdController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const eventData = await findEventByIdUseCase.execute(request.params);

  reply
    .status(200)
    .send({ data: eventData, message: "Evento encontrado com sucesso" });
};
