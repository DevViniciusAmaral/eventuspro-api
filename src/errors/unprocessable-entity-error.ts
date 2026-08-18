import { AppError } from "./app-error";

export class UnprocessableEntityError extends AppError {
  constructor(message = "Unprocessable entity.") {
    super({ message, code: "UNPROCESSABLE_ENTITY" });
  }
}
