import { FastifyReply, FastifyRequest } from "fastify";
import { userRepository } from "../user.repository";
import { NotFoundError } from "../../../errors/not-found-error";

export const findUserController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { uid } = request.user;
  const user = await userRepository.findOne("uid", uid);

  if (!user) {
    throw new NotFoundError("Usuário não encontrado");
  }

  reply.status(200).send({ data: user, message: "Usuário encontrado" });
};
