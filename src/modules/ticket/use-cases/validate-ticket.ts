import { UserType } from "../../../enums/user-type";
import { UnauthorizedError } from "../../../errors/unauthorized-error";
import { validateTicketSchema } from "../schemas/validate-ticket";
import { ticketRepository } from "../ticket.repository";
import { BadRequestError } from "../../../errors/bad-request-error";
import { User } from "../../user/models/user";

interface ValidateTicketInput {
  user: User;
  params: unknown;
}

export const validateTicketUseCase = {
  execute: async ({ user, params }: ValidateTicketInput) => {
    if (user.type !== UserType.DOORMAN) {
      throw new UnauthorizedError(
        "Você não tem permissão para realizar esta ação",
      );
    }

    const { hash } = validateTicketSchema.parse(params);
    const ticket = await ticketRepository.findOne("checkin.hash", hash);
    if (!ticket) {
      throw new BadRequestError("Ingresso inválido");
    }

    if (!ticket.isValid) {
      throw new BadRequestError("Ingresso já foi validado");
    }

    await ticketRepository.update(ticket.id!, { ...ticket, isValid: false });
  },
};
