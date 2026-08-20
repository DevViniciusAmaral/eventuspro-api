import { FastifyReply, FastifyRequest } from "fastify";
import { updateEventUseCase } from "../use-cases/update-event";

export const updateEventController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  await updateEventUseCase.execute({
    user: request.userData,
    params: request.params,
    body: request.body,
  });

  reply.status(200).send({ message: "Evento atualizado com sucesso" });
};
