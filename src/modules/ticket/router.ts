import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getUserMiddleware } from "../../middlewares/get-user";
import { createTicketCheckoutController } from "./controllers/create-ticket-checkout";
import { validateTicketCheckoutController } from "./controllers/validate-ticket-checkout";
import { cancelTicketController } from "./controllers/cancel-ticket";
import { findTicketByShareHashController } from "./controllers/find-ticket-by-share-hash";
import { validateTicketController } from "./controllers/validate-ticket";
import { listTicketsController } from "./controllers/list-tickets";

export const ticketRouter = (app: FastifyInstance) => {
  app.post(
    "/checkout",
    { onRequest: authMiddleware, preHandler: getUserMiddleware },
    createTicketCheckoutController,
  );
  app.patch("/checkout/validate", validateTicketCheckoutController);
  app.patch(
    "/cancel/:id",
    { onRequest: authMiddleware, preHandler: getUserMiddleware },
    cancelTicketController,
  );
  app.get("/share/:hash", findTicketByShareHashController);
  app.patch(
    "/validate/:hash",
    { onRequest: authMiddleware, preHandler: getUserMiddleware },
    validateTicketController,
  );
  app.get(
    "/",
    { onRequest: authMiddleware, preHandler: getUserMiddleware },
    listTicketsController,
  );
};
