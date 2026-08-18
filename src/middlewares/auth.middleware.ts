import { FastifyRequest } from "fastify";

import { auth } from "../lib/firebase";
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

  try {
    const { uid, email } = await auth.verifyIdToken(token);
    request.user = { uid, email };
  } catch {
    throw new UnauthorizedError("Invalid or expired token.");
  }
};
