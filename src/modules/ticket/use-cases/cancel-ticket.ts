import { cancelTicketSchema } from "../schemas/cancel-ticket";
import { ticketRepository } from "../ticket.repository";
import { NotFoundError } from "../../../errors/not-found-error";
import { UnauthorizedError } from "../../../errors/unauthorized-error";
import { paymentGateway } from "../../../lib/payment";
import { eventRepository } from "../../event/event.repository";
import { UserType } from "../../../enums/user-type";
import { User } from "../../user/models/user";

interface CancelTicketInput {
  user: User;
  params: unknown;
}

export const cancelTicketUseCase = {
  execute: async ({ user, params }: CancelTicketInput) => {
    const { id } = cancelTicketSchema.parse(params);

    const ticket = await ticketRepository.findById(id);
    if (!ticket) {
      throw new NotFoundError("Ingresso não encontrado");
    }

    const event = await eventRepository.findById(ticket.eventId);
    if (!event) {
      throw new NotFoundError("Evento não encontrado");
    }

    const isOrganizer =
      user.type === UserType.ORGANIZER && user.id === event.organizerId;

    if (!isOrganizer || ticket.clientId !== user.id || !ticket.isValid) {
      throw new UnauthorizedError(
        "Você não tem permissão para cancelar este ingresso",
      );
    }

    const { status } = await paymentGateway.createRefund(ticket.paymentId);

    if (status !== "succeeded") {
      return;
    }

    const seats = event.seats.map((seat) => {
      if (seat.clientId === ticket.clientId) return { code: seat.code };
      return seat;
    });

    await eventRepository.update(event.id!, { ...event, seats });
    await ticketRepository.delete(ticket.id!);
  },
};
