import { FastifyReply, FastifyRequest } from "fastify";
import { UserType } from "../../../enums/user-type";
import { UnauthorizedError } from "../../../errors/unauthorized-error";
import { updateEventSchema } from "../schemas/update-event";
import { eventFactory } from "../event.factory";
import { eventRepository } from "../event.repository";
import { updateEventParamsSchema } from "../schemas/update-event-params";
import { NotFoundError } from "../../../errors/not-found-error";

export const updateEventController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = request.userData;

  const { id } = updateEventParamsSchema.parse(request.params);
  const body = updateEventSchema.parse(request.body);

  const event = await eventRepository.findById(id);
  if (!event) {
    throw new NotFoundError("Evento não encontrado");
  }

  if (user.type !== UserType.ORGANIZER || event.organizerId !== user.id) {
    throw new UnauthorizedError(
      "Usuário não tem permissão para alterar o evento",
    );
  }

  const formattedEvent = eventFactory.execute({ ...event, ...body });
  await eventRepository.update(id, formattedEvent);

  reply.status(200).send({ message: "Evento atualizado com sucesso" });
};
