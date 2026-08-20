import { FastifyReply, FastifyRequest } from "fastify";
import { findTicketByShareHashUseCase } from "../use-cases/find-ticket-by-share-hash";

export const findTicketByShareHashController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const formattedTicket = await findTicketByShareHashUseCase.execute(
    req.params,
  );

  reply
    .status(200)
    .send({ data: formattedTicket, message: "Ingresso encontrado" });
};
