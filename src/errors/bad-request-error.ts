import { AppError } from "./app-error";

export class BadRequestError extends AppError {
  constructor(message = "Bad request.") {
    super({ message, code: "BAD_REQUEST" });
  }
}
