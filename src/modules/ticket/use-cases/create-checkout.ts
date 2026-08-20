import { createTicketCheckoutSchema } from "../schemas/create-ticket-checkout";
import { eventRepository } from "../../event/event.repository";
import { NotFoundError } from "../../../errors/not-found-error";
import { BadRequestError } from "../../../errors/bad-request-error";
import { paymentGateway } from "../../../lib/payment";
import { env } from "../../../config/env";
import { User } from "../../user/models/user";

interface CreateTicketCheckoutInput {
  user: User;
  body: unknown;
}

export const createTicketCheckoutUseCase = {
  execute: async ({ user, body }: CreateTicketCheckoutInput) => {
    const data = createTicketCheckoutSchema.parse(body);

    const event = await eventRepository.findById(data.eventId);
    if (!event) {
      throw new NotFoundError("Evento não encontrado");
    }

    const seatCodes = event.seats.map((seat) => seat.code);
    const invalidSeats = data.seats.filter((code) => !seatCodes.includes(code));
    if (invalidSeats.length > 0) {
      throw new BadRequestError(
        `Assentos ${invalidSeats.join(",")} são inválidos`,
      );
    }

    const validSeats = data.seats.filter((code) => seatCodes.includes(code));
    const seatsPurchased = event.seats
      .filter((seat) => !!seat.clientId)
      .map((seat) => seat.code);

    const unavailableSeats = validSeats.filter((code) =>
      seatsPurchased.includes(code),
    );
    if (unavailableSeats.length > 0) {
      throw new BadRequestError(
        `Assentos ${unavailableSeats.join(",")} não estão disponíveis`,
      );
    }

    const availableSeats = validSeats.filter(
      (code) => !seatsPurchased.includes(code),
    );

    const { url } = await paymentGateway.createCheckoutSession({
      priceId: event.priceId,
      quantity: availableSeats.length,
      successUrl: `${env.FRONTEND_URL}/checkout/validate?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: env.FRONTEND_URL,
      customerEmail: user.email,
      metadata: {
        userId: user.id!,
        eventId: data.eventId,
        seats: availableSeats.join(","),
      },
    });

    return { checkoutUrl: url };
  },
};
