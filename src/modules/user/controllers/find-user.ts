import { FastifyReply, FastifyRequest } from "fastify";

export const findUserController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = request.userData;
  reply.status(200).send({ data: user, message: "Usuário encontrado" });
};
