import { listEventsSchema } from "../schemas/list-events-schema";
import { eventRepository } from "../event.repository";
import { Event } from "../models/event";

export const listEventsUseCase = {
  execute: async (query: unknown) => {
    const parsed = listEventsSchema.parse(query);

    let events: Event[] = [];
    if (parsed.organizerId) {
      events = await eventRepository.findMany(
        "organizerId",
        parsed.organizerId,
      );
    } else {
      events = await eventRepository.list();
    }

    return events.map((event) => {
      const { organizerId, priceId, ...rest } = event;
      return rest;
    });
  },
};
