import { ticketRepository } from "../ticket.repository";
import { findTicketByShareHashSchema } from "../schemas/find-ticket-by-share-hash";
import { NotFoundError } from "../../../errors/not-found-error";
import { eventRepository } from "../../event/event.repository";

export const findTicketByShareHashUseCase = {
  execute: async (params: unknown) => {
    const { hash } = findTicketByShareHashSchema.parse(params);

    const ticket = await ticketRepository.findOne("share.hash", hash);
    if (!ticket) {
      throw new NotFoundError("Ticket não encontrado");
    }

    const event = await eventRepository.findById(ticket.eventId);
    if (!event) {
      throw new NotFoundError("Evento não encontrado");
    }

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
      qrCode: ticket.share.qrcode,
    };
  },
};
