import { FastifyInstance } from "fastify";
import { userRouter } from "./modules/user/router";
import { eventRouter } from "./modules/event/router";
import { ticketRouter } from "./modules/ticket/router";
import { movieRouter } from "./modules/movies/router";

export const appRouter = (app: FastifyInstance) => {
  app.register(userRouter, { prefix: "/user" });
  app.register(eventRouter, { prefix: "/event" });
  app.register(ticketRouter, { prefix: "/ticket" });
  app.register(movieRouter, { prefix: "/movie" });
};
