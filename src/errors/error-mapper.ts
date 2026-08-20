import { z } from "zod";
import { AppError, type ErrorDetails } from "./app-error";

export const mapZodError = (error: z.ZodError): AppError => {
  const details: ErrorDetails[] = error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

  return new AppError({
    message: "Dados inválidos.",
    code: "UNPROCESSABLE_ENTITY",
    details,
  });
};

export const isZodError = (error: unknown): error is z.ZodError => {
  return error instanceof z.ZodError;
};
