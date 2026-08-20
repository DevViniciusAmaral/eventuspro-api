import { findEventByIdSchema } from "../schemas/find-event-by-id";
import { eventRepository } from "../event.repository";
import { NotFoundError } from "../../../errors/not-found-error";

export const findEventByIdUseCase = {
  execute: async (params: unknown) => {
    const { id } = findEventByIdSchema.parse(params);
    const event = await eventRepository.findById(id);

    if (!event) {
      throw new NotFoundError("Evento não encontrado");
    }

    const { organizerId, priceId, ...eventData } = event;
    return eventData;
  },
};
