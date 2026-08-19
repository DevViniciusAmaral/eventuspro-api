import { FastifyReply, FastifyRequest } from "fastify";
import { createTicketCheckoutSchema } from "../schemas/create-ticket-checkout";
import { eventRepository } from "../../event/event.repository";
import { NotFoundError } from "../../../errors/not-found-error";
import { BadRequestError } from "../../../errors/bad-request-error";
import { stripe } from "../../../lib/stripe";
import { env } from "../../../config/env";

export const createTicketCheckoutController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = request.userData;
  const body = createTicketCheckoutSchema.parse(request.body);

  const event = await eventRepository.findById(body.eventId);
  if (!event) {
    throw new NotFoundError("Evento não encontrado");
  }

  const seatCodes = event.seats.map((seat) => seat.code);
  const invalidSeats = body.seats.filter((code) => !seatCodes.includes(code));
  if (invalidSeats.length > 0) {
    throw new BadRequestError(
      `Assentos ${invalidSeats.join(",")} não são inválidos`,
    );
  }

  const validSeats = body.seats.filter((code) => seatCodes.includes(code));
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

  const { url } = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: event.priceId, quantity: availableSeats.length }],
    success_url: `${env.FRONTEND_URL}/checkout/validate?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: env.FRONTEND_URL,
    customer_email: user.email,
    metadata: {
      userId: user.id,
      eventId: body.eventId,
      seats: availableSeats.join(","),
    },
  });

  reply
    .status(200)
    .send({ checkoutUrl: url, message: "Checkout criado com sucesso" });
};
