import { FastifyReply, FastifyRequest } from "fastify";
import { validateTicketCheckoutUseCase } from "../use-cases/validate-checkout";

export const validateTicketCheckoutController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const ticket = await validateTicketCheckoutUseCase.execute(request.query);

  reply
    .status(200)
    .send({ data: ticket, message: "Ticket validado com sucesso" });
};
