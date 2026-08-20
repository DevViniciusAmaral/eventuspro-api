import { FastifyReply, FastifyRequest } from "fastify";
import { createUserUseCase } from "../use-cases/create-user";

export const createUserController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const { email } = request.userAuth;
  const body = request.body as any;
  const user = await createUserUseCase.execute({ email, ...body });
  reply.status(201).send({ data: user, message: "Usuário criado com sucesso" });
};
