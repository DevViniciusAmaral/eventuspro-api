import { FastifyInstance } from "fastify";
import { createEventController } from "./controllers/create-event";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getUserMiddleware } from "../../middlewares/get-user";

export const eventRouter = (app: FastifyInstance) => {
  app.addHook("onRequest", authMiddleware);
  app.addHook("preHandler", getUserMiddleware);
  app.post("/", createEventController);
  // app.get("/", listEventsController);
};
