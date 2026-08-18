import Fastify from "fastify";
import { globalErrorHandler } from "./infra/http/global-error-handler";

export const app = Fastify();

app.setErrorHandler(globalErrorHandler);
