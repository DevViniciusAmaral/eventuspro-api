import { FastifyReply, FastifyRequest } from "fastify";
import { cancelTicketSchema } from "../schemas/cancel-ticket";
import { ticketRepository } from "../ticket.repository";
import { NotFoundError } from "../../../errors/not-found-error";
import { UnauthorizedError } from "../../../errors/unauthorized-error";
import { stripe } from "../../../lib/stripe";
import { eventRepository } from "../../event/event.repository";
import { UserType } from "../../../enums/user-type";

export const cancelTicketController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = request.userData;
  const { id } = cancelTicketSchema.parse(request.params);

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

  if (isOrganizer || ticket.clientId !== user.id) {
    throw new UnauthorizedError(
      "Você não tem permissão para cancelar este ingresso",
    );
  }

  const { status } = await stripe.refunds.create({
    payment_intent: ticket.paymentId,
  });
  if (status === "succeeded") {
    await ticketRepository.delete(id);
    const seats = event.seats.map((seat) => {
      if (seat.clientId === user.id) return { code: seat.code };
      return seat;
    });
    await eventRepository.update(event.id, { ...event, seats });
  }

  reply.status(200).send({ message: "Ingresso cancelado com sucesso" });
};
