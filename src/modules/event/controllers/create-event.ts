import { FastifyReply, FastifyRequest } from "fastify";
import { createEventUseCase } from "../use-cases/create-event";

export const createEventController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const createdEvent = await createEventUseCase.execute({
    user: request.userData,
    body: request.body,
  });

  reply
    .status(201)
    .send({ data: createdEvent, message: "Evento criado com sucesso" });
};
