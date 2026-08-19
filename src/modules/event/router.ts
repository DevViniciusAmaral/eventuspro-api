import { FastifyInstance } from "fastify";
import { createEventController } from "./controllers/create-event";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getUserMiddleware } from "../../middlewares/get-user";
import { listEventsController } from "./controllers/list-events";
import { updateEventController } from "./controllers/update-event";
import { findEventByIdController } from "./controllers/find-event-by-id";

export const eventRouter = (app: FastifyInstance) => {
  app.post(
    "/",
    { onRequest: authMiddleware, preHandler: getUserMiddleware },
    createEventController,
  );
  app.put(
    "/:id",
    { onRequest: authMiddleware, preHandler: getUserMiddleware },
    updateEventController,
  );
  app.get("/", listEventsController);
  app.get("/:id", findEventByIdController);
};
