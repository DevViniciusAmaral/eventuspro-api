import Fastify from "fastify";
import cors from "@fastify/cors";
import { errorHandler } from "./errors/error-handler";
import { appRouter } from "./router";

export const app = Fastify();

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
});
app.setErrorHandler(errorHandler);
app.get("/health", async () => ({ status: "ok" }));
app.register(appRouter);
