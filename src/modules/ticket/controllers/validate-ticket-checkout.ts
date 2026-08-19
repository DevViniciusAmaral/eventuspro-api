import { FastifyReply, FastifyRequest } from "fastify";
import { validateTicketCheckoutSchema } from "../schemas/validate-ticket-checkout";
import { stripe } from "../../../lib/stripe";
import { ConflictError } from "../../../errors/conflict-error";
import { ticketFactory } from "../ticket.factory";
import { ticketRepository } from "../ticket.repository";
import { eventRepository } from "../../event/event.repository";
import { NotFoundError } from "../../../errors/not-found-error";

interface TicketData {
  userId: string;
  eventId: string;
  seats: string;
}

export const validateTicketCheckoutController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { sessionId } = validateTicketCheckoutSchema.parse(request.query);

  const checkout = await stripe.checkout.sessions.retrieve(sessionId);
  if (checkout.payment_status !== "paid") {
    throw new ConflictError("O pagamento ainda não foi confirmado");
  }

  const ticketData = checkout.metadata as any as TicketData;
  const event = await eventRepository.findById(ticketData.eventId);
  if (!event) {
    throw new NotFoundError("O evento não foi encontrado");
  }

  const formattedTicket = ticketFactory.execute({
    eventId: ticketData.eventId,
    clientId: ticketData.userId,
    paymentId: checkout.payment_intent,
    isValid: true,
  });

  const ticket = await ticketRepository.create(formattedTicket);

  const seats = event.seats.map((seat) => {
    if (ticketData.seats.includes(seat.code)) seat.clientId = ticketData.userId;
    return seat;
  });
  await eventRepository.update(event.id, { ...event, seats });

  reply
    .status(200)
    .send({ data: ticket, message: "Ticket validado com sucesso" });
};
