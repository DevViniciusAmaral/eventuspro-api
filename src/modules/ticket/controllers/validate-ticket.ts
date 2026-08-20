import { FastifyReply, FastifyRequest } from "fastify";
import { UserType } from "../../../enums/user-type";
import { UnauthorizedError } from "../../../errors/unauthorized-error";
import { validateTicketSchema } from "../schemas/validate-ticket";
import { ticketRepository } from "../ticket.repository";
import { BadRequestError } from "../../../errors/bad-request-error";

export const validateTicketController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = request.userData;

  if (user.type !== UserType.DOORMAN) {
    throw new UnauthorizedError(
      "Você não tem permissão para realizar esta ação",
    );
  }

  const { hash } = validateTicketSchema.parse(request.params);
  const ticket = await ticketRepository.findOne("checkin.hash", hash);
  if (!ticket) {
    throw new BadRequestError("Ingresso inválido");
  }

  if (!ticket.isValid) {
    throw new BadRequestError("Ingresso já foi validado");
  }

  await ticketRepository.update(ticket.id, { ...ticket, isValid: false });

  reply.status(200).send({ message: "Ingresso validado" });
};
