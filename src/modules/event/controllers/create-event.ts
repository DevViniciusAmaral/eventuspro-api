import { FastifyReply, FastifyRequest } from "fastify";
import { createEventSchema } from "../schemas/create-event";
import { userRepository } from "../../user/user.repository";
import { NotFoundError } from "../../../errors/not-found-error";
import { eventFactory } from "../event.factory";
import { eventRepository } from "../event.repository";
import { UserType } from "../../../enums/user-type";
import { UnauthorizedError } from "../../../errors/unauthorized-error";

export const createEventController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = request.userData;

  if (user.type !== UserType.ORIGANIZER) {
    throw new UnauthorizedError("Usuário não tem permissão para criar eventos");
  }

  const body = request.body as any;
  const data = createEventSchema.parse({ organizerId: user.id, ...body });
  const formattedEvent = eventFactory.execute(data);
  const createdEvent = await eventRepository.create(formattedEvent);

  reply
    .status(201)
    .send({ data: createdEvent, message: "Evento criado com sucesso" });
};
