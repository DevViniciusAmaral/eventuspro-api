import { FastifyReply, FastifyRequest } from "fastify";
import { createTicketCheckoutUseCase } from "../use-cases/create-checkout";

export const createTicketCheckoutController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { checkoutUrl } = await createTicketCheckoutUseCase.execute({
    user: request.userData,
    body: request.body,
  });

  reply
    .status(200)
    .send({ checkoutUrl, message: "Checkout criado com sucesso" });
};
