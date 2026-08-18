import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { env } from "../../config/env";
import { AppError } from "../../core/errors/app-error";
import {
  isZodError,
  isFirebaseError,
  mapZodError,
  mapFirebaseError,
} from "../errors/error-mapper";

interface ErrorResponse {
  message: string;
  code: string;
  details?: Array<{ field?: string; message: string }>;
  stack?: string;
}

const isProduction = env.PORT ? false : process.env.NODE_ENV === "production";

export const globalErrorHandler = (
  error: FastifyError | Error | unknown,
  _request: FastifyRequest,
  reply: FastifyReply,
): void => {
  let appError: AppError;

  if (error instanceof AppError) {
    appError = error;
  } else if (isZodError(error)) {
    appError = mapZodError(error);
  } else if (isFirebaseError(error)) {
    appError = mapFirebaseError(error);
  } else if (error instanceof Error) {
    console.error("[UNHANDLED_ERROR]", error);
    appError = new AppError({
      message: "Erro interno do servidor.",
      code: "INTERNAL_SERVER_ERROR",
    });
  } else {
    console.error("[UNKNOWN_ERROR]", error);
    appError = new AppError({
      message: "Erro interno do servidor.",
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  const response: ErrorResponse = {
    message: appError.message,
    code: appError.code,
  };

  if (appError.details && appError.details.length > 0) {
    response.details = appError.details;
  }

  if (!isProduction && error instanceof Error && error.stack) {
    response.stack = error.stack;
  }

  reply.status(appError.statusCode).send(response);
};
