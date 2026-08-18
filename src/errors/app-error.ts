export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "UNPROCESSABLE_ENTITY"
  | "INTERNAL_SERVER_ERROR";

export interface ErrorDetails {
  field?: string;
  message: string;
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: ErrorCode;
  readonly details?: ErrorDetails[];

  constructor(params: {
    message: string;
    code: ErrorCode;
    details?: ErrorDetails[];
  }) {
    super(params.message);
    this.name = "AppError";
    this.code = params.code;
    this.statusCode = AppError.getHttpStatus(params.code);
    this.details = params.details;
  }

  private static getHttpStatus(code: ErrorCode) {
    return {
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      CONFLICT: 409,
      UNPROCESSABLE_ENTITY: 422,
      INTERNAL_SERVER_ERROR: 500,
    }[code];
  }
}
