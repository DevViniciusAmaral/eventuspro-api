import { FastifyReply, FastifyRequest } from "fastify";
import { validateTicketCheckoutSchema } from "../schemas/validate-ticket-checkout";
import { stripe } from "../../../lib/stripe";
import { ConflictError } from "../../../errors/conflict-error";
import { ticketFactory } from "../ticket.factory";
import { ticketRepository } from "../ticket.repository";
import { eventRepository } from "../../event/event.repository";
import { NotFoundError } from "../../../errors/not-found-error";
import crypto from "node:crypto";
import { toDataURL as qrCodeToDataURL } from "qrcode";

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

  const checkinToken = crypto.randomBytes(32).toString("hex");
  const checkinHash = crypto
    .createHash("sha256")
    .update(checkinToken)
    .digest("hex");
  const checkinQrcode = await qrCodeToDataURL(checkinHash);

  const shareToken = crypto.randomBytes(32).toString("hex");
  const shareHash = crypto
    .createHash("sha256")
    .update(shareToken)
    .digest("hex");
  const shareQrcode = await qrCodeToDataURL(shareHash);

  const formattedTicket = ticketFactory.execute({
    eventId: ticketData.eventId,
    clientId: ticketData.userId,
    paymentId: checkout.payment_intent,
    isValid: true,
    checkin: { hash: checkinHash, qrcode: checkinQrcode },
    share: { hash: shareHash, qrcode: shareQrcode },
    seats: ticketData.seats.split(","),
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
