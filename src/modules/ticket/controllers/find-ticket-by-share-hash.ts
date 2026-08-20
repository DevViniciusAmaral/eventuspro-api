import { FastifyReply, FastifyRequest } from "fastify";
import { ticketRepository } from "../ticket.repository";
import { findTicketByShareHashSchema } from "../schemas/find-ticket-by-share-hash";
import { NotFoundError } from "../../../errors/not-found-error";
import { eventRepository } from "../../event/event.repository";

export const findTicketByShareHashController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { hash } = findTicketByShareHashSchema.parse(req.params);

  const ticket = await ticketRepository.findOne("share.hash", hash);
  if (!ticket) {
    throw new NotFoundError("Ticket não encontrado");
  }

  const event = await eventRepository.findById(ticket.eventId);
  if (!event) {
    throw new NotFoundError("Evento não encontrado");
  }

  const formattedTicket = {
    event: {
      title: event.title,
      description: event.description,
      date: event.date,
      local: event.local,
    },
    isValid: ticket.isValid,
    seats: ticket.seats,
    createdAt: ticket.createdAt,
    qrCode: ticket.share.qrcode,
  };

  reply
    .status(200)
    .send({ data: formattedTicket, message: "Ingresso encontrado" });
};
