import { FastifyInstance } from "fastify";
import { createEventController } from "./controllers/create-event";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getUserMiddleware } from "../../middlewares/get-user";
import { listEventsController } from "./controllers/list-events";
import { updateEventController } from "./controllers/update-event";

export const eventRouter = (app: FastifyInstance) => {
  app.addHook("onRequest", authMiddleware);
  app.addHook("preHandler", getUserMiddleware);
  app.post("/", createEventController);
  app.get("/", listEventsController);
  app.put("/:id", updateEventController);
};
