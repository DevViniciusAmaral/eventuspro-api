import Fastify from "fastify";
import { errorHandler } from "./errors/error-handler";

export const app = Fastify();

app.setErrorHandler(errorHandler);
