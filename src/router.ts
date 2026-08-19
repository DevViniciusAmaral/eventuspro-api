import { FastifyInstance } from "fastify";
import { userRouter } from "./modules/user/router";
import { eventRouter } from "./modules/event/router";

export const appRouter = (app: FastifyInstance) => {
  app.register(userRouter, { prefix: "/user" });
  app.register(eventRouter, { prefix: "/event" });
};
