import Fastify from "fastify";
import { errorHandler } from "./errors/error-handler";
import { appRouter } from "./router";

export const app = Fastify();

app.setErrorHandler(errorHandler);
app.register(appRouter);
