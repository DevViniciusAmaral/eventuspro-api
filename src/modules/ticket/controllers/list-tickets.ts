import { FastifyReply, FastifyRequest } from "fastify";
import { UserType } from "../../../enums/user-type";
import { UnauthorizedError } from "../../../errors/unauthorized-error";
import { ticketRepository } from "../ticket.repository";
import { eventRepository } from "../../event/event.repository";
import { Event } from "../../event/models/event";

export const listTicketsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = request.userData;

  if (user.type !== UserType.CLIENT) {
    throw new UnauthorizedError(
      "Você não tem permissão para acessar esse recurso",
    );
  }

  const tickets = await ticketRepository.findMany("clientId", user.id);
  if (tickets.length === 0) {
    reply
      .status(200)
      .send({ data: [], message: "Ingressos listados com sucesso" });
  }

  const events = (
    await Promise.allSettled(
      tickets.map((ticket) => eventRepository.findById(ticket.eventId)),
    )
  )
    .filter((event) => event.status === "fulfilled")
    .map((event) => event.value as Event);

  const formattedTickets = tickets.map((ticket) => {
    const event = events.find((event) => event.id === ticket.eventId)!;
    return {
      event: {
        title: event.title,
        description: event.description,
        date: event.date,
        local: event.local,
      },
      isValid: ticket.isValid,
      seats: ticket.seats,
      createdAt: ticket.createdAt,
    };
  });

  reply.status(200).send({
    data: formattedTickets,
    message: "Ingressos listados com sucesso",
  });
};
