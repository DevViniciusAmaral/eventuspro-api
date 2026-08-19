import { FastifyRequest } from "fastify";
import { NotFoundError } from "../errors/not-found-error";
import { userRepository } from "../modules/user/user.repository";

export const getUserMiddleware = async (request: FastifyRequest) => {
  const { email } = request.userAuth;

  const user = await userRepository.findOne("email", email);
  if (!user) {
    throw new NotFoundError("Usuário não encontrado");
  }

  request.userData = user;
};
