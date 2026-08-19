import { FastifyInstance } from "fastify";
import { userRouter } from "./modules/user/router";

export const appRouter = (app: FastifyInstance) => {
  app.register(userRouter, { prefix: "/user" });
};
