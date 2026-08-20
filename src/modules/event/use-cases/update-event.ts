import { updateEventSchema } from "../schemas/update-event";
import { updateEventParamsSchema } from "../schemas/update-event-params";
import { eventFactory } from "../event.factory";
import { eventRepository } from "../event.repository";
import { UserType } from "../../../enums/user-type";
import { UnauthorizedError } from "../../../errors/unauthorized-error";
import { NotFoundError } from "../../../errors/not-found-error";
import { User } from "../../user/models/user";

interface UpdateEventInput {
  user: User;
  params: unknown;
  body: unknown;
}

export const updateEventUseCase = {
  execute: async ({ user, params, body }: UpdateEventInput) => {
    const { id } = updateEventParamsSchema.parse(params);
    const data = updateEventSchema.parse(body);

    const event = await eventRepository.findById(id);
    if (!event) {
      throw new NotFoundError("Evento não encontrado");
    }

    if (user.type !== UserType.ORGANIZER || event.organizerId !== user.id) {
      throw new UnauthorizedError(
        "Usuário não tem permissão para alterar o evento",
      );
    }

    const formattedEvent = eventFactory.execute({ ...event, ...data });
    await eventRepository.update(id, formattedEvent);
  },
};
