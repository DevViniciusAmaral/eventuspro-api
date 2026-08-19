import { FastifyReply, FastifyRequest } from "fastify";
import { Event } from "../models/event";
import { eventRepository } from "../event.repository";
import { listEventsSchema } from "../schemas/list-events-schema";

export const listEventsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const query = listEventsSchema.parse(request.query);

  let events: Event[] = [];
  if (query.organizerId) {
    events = await eventRepository.findMany("organizerId", query.organizerId);
  } else {
    events = await eventRepository.list();
  }

  const formattedEvents = events.map((event) => {
    const { organizerId, priceId, ...rest } = event;
    return rest;
  });

  reply
    .status(200)
    .send({ data: formattedEvents, message: "Eventos listados com sucesso" });
};
