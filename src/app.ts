import Fastify from "fastify";
import cors from "@fastify/cors";
import { errorHandler } from "./errors/error-handler";
import { appRouter } from "./router";

export const app = Fastify();

app.register(cors, { origin: "*" });
app.setErrorHandler(errorHandler);
app.get("/health", async () => ({ status: "ok" }));
app.register(appRouter);
