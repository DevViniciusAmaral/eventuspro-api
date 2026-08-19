import { FastifyReply, FastifyRequest } from "fastify";
import { createEventSchema } from "../schemas/create-event";
import { userRepository } from "../../user/user.repository";
import { NotFoundError } from "../../../errors/not-found-error";
import { eventFactory } from "../event.factory";
import { eventRepository } from "../event.repository";
import { UserType } from "../../../enums/user-type";
import { UnauthorizedError } from "../../../errors/unauthorized-error";
import { generateSeats } from "../../../utils/generate-seats";

export const createEventController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = request.userData;

  if (user.type !== UserType.ORGANIZER) {
    throw new UnauthorizedError("Usuário não tem permissão para criar eventos");
  }

  const body = request.body as any;
  const data = createEventSchema.parse({ organizerId: user.id, ...body });

  const seatsPerRow = data.capacity >= 100 ? 20 : 10;
  const seats = generateSeats(data.capacity, seatsPerRow);

  const formattedEvent = eventFactory.execute({ ...data, seats });
  const createdEvent = await eventRepository.create(formattedEvent);

  reply
    .status(201)
    .send({ data: createdEvent, message: "Evento criado com sucesso" });
};
