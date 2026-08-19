import { FastifyReply, FastifyRequest } from "fastify";
import { Event } from "../models/event";
import { UserType } from "../../../enums/user-type";
import { eventRepository } from "../event.repository";
import { UnauthorizedError } from "../../../errors/unauthorized-error";
import { ticketRepository } from "../../ticket/ticket.repository";

export const listEventsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = request.userData;

  if (user.type === UserType.DOORMAN) {
    throw new UnauthorizedError(
      "Usuário não tem permissão para listar eventos",
    );
  }

  let events: Event[] = [];
  if (user.type === UserType.ORIGANIZER) {
    events = await eventRepository.findMany("organizerId", user.id);
  } else {
    const tickets = await ticketRepository.findMany("clientId", user.id);

    events = (
      await Promise.allSettled(
        tickets.map(({ eventId }) => eventRepository.findOne("id", eventId)),
      )
    )
      .filter((event) => event.status === "fulfilled")
      .map((event) => event.value);
  }

  reply
    .status(200)
    .send({ data: events, message: "Eventos listados com sucesso" });
};
