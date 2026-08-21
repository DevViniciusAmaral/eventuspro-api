import { validateTicketCheckoutSchema } from "../schemas/validate-ticket-checkout";
import { paymentGateway } from "../../../lib/payment";
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

const generateHashPair = async () => {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  const qrcode = await qrCodeToDataURL(hash);
  return { hash, qrcode };
};

export const validateTicketCheckoutUseCase = {
  execute: async (query: unknown) => {
    const { sessionId } = validateTicketCheckoutSchema.parse(query);

    const session = await paymentGateway.retrieveCheckoutSession(sessionId);
    if (session.paymentStatus !== "paid") {
      throw new ConflictError("O pagamento ainda não foi confirmado");
    }

    const ticketData = session.metadata as unknown as TicketData;
    const isExists = await ticketRepository.findOne("sessionId", sessionId);
    if (isExists) {
      throw new ConflictError("O pagamento já foi validado");
    }

    const event = await eventRepository.findById(ticketData.eventId);
    if (!event) {
      throw new NotFoundError("O evento não foi encontrado");
    }

    const checkin = await generateHashPair();
    const share = await generateHashPair();

    const formattedTicket = ticketFactory.execute({
      eventId: ticketData.eventId,
      clientId: ticketData.userId,
      paymentId: session.paymentIntentId,
      sessionId,
      isValid: true,
      checkin,
      share,
      seats: ticketData.seats.split(","),
    });

    const ticket = await ticketRepository.create(formattedTicket);

    const seats = event.seats.map((seat) => {
      if (ticketData.seats.includes(seat.code)) {
        seat.clientId = ticketData.userId;
      }
      return seat;
    });

    await eventRepository.update(event.id!, { ...event, seats });

    return ticket;
  },
};
