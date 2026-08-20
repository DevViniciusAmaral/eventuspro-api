import { FastifyReply, FastifyRequest } from "fastify";
import { listTicketsUseCase } from "../use-cases/list-tickets";

export const listTicketsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const formattedTickets = await listTicketsUseCase.execute(request.userData);

  reply.status(200).send({
    data: formattedTickets,
    message: "Ingressos listados com sucesso",
  });
};
