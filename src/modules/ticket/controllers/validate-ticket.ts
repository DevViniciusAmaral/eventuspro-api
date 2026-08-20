import { FastifyReply, FastifyRequest } from "fastify";
import { validateTicketUseCase } from "../use-cases/validate-ticket";

export const validateTicketController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  await validateTicketUseCase.execute({
    user: request.userData,
    params: request.params,
  });

  reply.status(200).send({ message: "Ingresso validado" });
};
