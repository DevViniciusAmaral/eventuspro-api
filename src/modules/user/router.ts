import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { createUserController } from "./controllers/create-user";
import { findUserController } from "./controllers/find-user";

export const userRouter = (app: FastifyInstance) => {
  app.addHook("onRequest", authMiddleware);
  app.post("/", createUserController);
  app.get("/", findUserController);
};
