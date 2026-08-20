import { FastifyReply, FastifyRequest } from "fastify";
import { cancelTicketUseCase } from "../use-cases/cancel-ticket";

export const cancelTicketController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  await cancelTicketUseCase.execute({
    user: request.userData,
    params: request.params,
  });

  reply.status(200).send({ message: "Ingresso cancelado com sucesso" });
};
