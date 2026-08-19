import { FastifyReply, FastifyRequest } from "fastify";

export const listEventsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = request.userData;
};
