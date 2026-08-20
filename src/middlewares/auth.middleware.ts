import { FastifyRequest } from "fastify";
import { authProvider } from "../lib/auth";
import { UnauthorizedError } from "../errors/unauthorized-error";

export const authMiddleware = async (request: FastifyRequest) => {
  const authorization = request.headers.authorization;

  if (!authorization) {
    throw new UnauthorizedError("Authorization header is missing.");
  }

  const [type, token] = authorization.split(" ");

  if (type !== "Bearer" || !token) {
    throw new UnauthorizedError("Invalid authorization header.");
  }

  const { uid, email } = await authProvider.verifyToken(token);
  console.log(uid, email);
  request.userAuth = { uid, email };
};
