import { FastifyReply, FastifyRequest } from "fastify";
import { createEventSchema } from "../schemas/create-event";
import { eventFactory } from "../event.factory";
import { eventRepository } from "../event.repository";
import { UserType } from "../../../enums/user-type";
import { UnauthorizedError } from "../../../errors/unauthorized-error";
import { generateSeats } from "../../../utils/generate-seats";
import { stripe } from "../../../lib/stripe";

export const createEventController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = request.userData;

  if (user.type !== UserType.ORGANIZER) {
    throw new UnauthorizedError("Usuário não tem permissão para criar eventos");
  }

  const body = request.body as any;
  const data = createEventSchema.parse({ organizerId: user.id, ...body });

  const product = await stripe.products.create({
    name: data.title,
    description: data.description,
  });

  const price = await stripe.prices.create({
    product: product.id,
    currency: "brl",
    unit_amount: data.price,
  });

  const seatsPerRow = data.capacity >= 100 ? 20 : 10;
  const seats = generateSeats(data.capacity, seatsPerRow);

  const event = eventFactory.execute({ ...data, seats, priceId: price.id });
  const createdEvent = await eventRepository.create(event);

  reply
    .status(201)
    .send({ data: createdEvent, message: "Evento criado com sucesso" });
};
