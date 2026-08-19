import { FastifyReply, FastifyRequest } from "fastify";
import { createUserSchema } from "../schemas/create-user";
import { userFactory } from "../user.factory";
import { userRepository } from "../user.repository";

export const createUserController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { uid, email } = request.user;
  const body = request.body as any;
  const userData = createUserSchema.parse({ uid, email, ...body });

  const formattedUser = userFactory.execute(userData);
  const user = await userRepository.create(formattedUser);

  reply.status(201).send({ data: user, message: "Usuário criado com sucesso" });
};
