import { FastifyReply, FastifyRequest } from "fastify";
import { findEventByIdSchema } from "../schemas/find-event-by-id";
import { eventRepository } from "../event.repository";
import { NotFoundError } from "../../../errors/not-found-error";

export const findEventByIdController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id } = findEventByIdSchema.parse(request.params);
  const event = await eventRepository.findById(id);

  if (!event) {
    throw new NotFoundError("Evento não encontrado");
  }

  const { organizerId, priceId, ...eventData } = event;

  reply
    .status(200)
    .send({ data: eventData, message: "Evento encontrado com sucesso" });
};
