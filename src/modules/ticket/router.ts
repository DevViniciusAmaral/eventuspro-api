import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getUserMiddleware } from "../../middlewares/get-user";
import { createTicketCheckoutController } from "./controllers/create-ticket-checkout";
import { validateTicketCheckoutController } from "./controllers/validate-ticket-checkout";
import { cancelTicketController } from "./controllers/cancel-ticket";

export const ticketRouter = (app: FastifyInstance) => {
  app.addHook("onRequest", authMiddleware);
  app.addHook("preHandler", getUserMiddleware);
  app.post("/checkout", createTicketCheckoutController);
  app.patch("/checkout/validate", validateTicketCheckoutController);
  app.patch("/cancel/:id", cancelTicketController);
  // app.get("/:hash", findTicketByShareHashController);
  // app.patch("/validate", validateTicketController); // Validar checkinHash
};
