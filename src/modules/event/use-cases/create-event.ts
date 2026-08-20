import { createEventSchema } from "../schemas/create-event";
import { eventFactory } from "../event.factory";
import { eventRepository } from "../event.repository";
import { UserType } from "../../../enums/user-type";
import { UnauthorizedError } from "../../../errors/unauthorized-error";
import { generateSeats } from "../../../utils/generate-seats";
import { paymentGateway } from "../../../lib/payment";
import { User } from "../../user/models/user";

interface CreateEventInput {
  user: User;
  body: unknown;
}

export const createEventUseCase = {
  execute: async ({ user, body }: CreateEventInput) => {
    if (user.type !== UserType.ORGANIZER) {
      throw new UnauthorizedError(
        "Usuário não tem permissão para criar eventos",
      );
    }

    const data = createEventSchema.parse({
      organizerId: user.id,
      ...(body as object),
    });

    const product = await paymentGateway.createProduct({
      name: data.title,
      description: data.description,
    });

    const price = await paymentGateway.createPrice({
      productId: product.id,
      currency: "brl",
      unitAmount: data.price,
    });

    const seatsPerRow = data.capacity >= 100 ? 20 : 10;
    const seats = generateSeats(data.capacity, seatsPerRow);
    const event = eventFactory.execute({ ...data, seats, priceId: price.id });

    return await eventRepository.create(event);
  },
};
