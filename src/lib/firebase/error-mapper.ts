import { AppError, type ErrorCode } from "../../errors/app-error";

const firebaseErrorMap: Record<string, { code: ErrorCode; message: string }> = {
  "auth/invalid-email": { code: "BAD_REQUEST", message: "Email inválido." },
  "auth/user-disabled": { code: "FORBIDDEN", message: "Usuário desativado." },
  "auth/user-not-found": {
    code: "NOT_FOUND",
    message: "Usuário não encontrado.",
  },
  "auth/wrong-password": {
    code: "UNAUTHORIZED",
    message: "Credenciais inválidas.",
  },
  "auth/email-already-exists": {
    code: "CONFLICT",
    message: "Email já cadastrado.",
  },
  "auth/email-already-in-use": {
    code: "CONFLICT",
    message: "Email já cadastrado.",
  },
  "auth/invalid-password": { code: "BAD_REQUEST", message: "Senha inválida." },
  "auth/weak-password": { code: "BAD_REQUEST", message: "Senha muito fraca." },
  "auth/id-token-expired": {
    code: "UNAUTHORIZED",
    message: "Sessão expirada.",
  },
  "auth/id-token-revoked": {
    code: "UNAUTHORIZED",
    message: "Sessão revogada.",
  },
  "auth/invalid-id-token": { code: "UNAUTHORIZED", message: "Token inválido." },
  "auth/argument-error": {
    code: "BAD_REQUEST",
    message: "Argumento inválido.",
  },
  "auth/invalid-credential": {
    code: "UNAUTHORIZED",
    message: "Credenciais inválidas.",
  },
  "auth/session-cookie-expired": {
    code: "UNAUTHORIZED",
    message: "Sessão expirada.",
  },
  "auth/session-cookie-revoked": {
    code: "UNAUTHORIZED",
    message: "Sessão revogada.",
  },
  "auth/uid-already-exists": { code: "CONFLICT", message: "UID já existe." },
  "not-found": { code: "NOT_FOUND", message: "Recurso não encontrado." },
  "already-exists": { code: "CONFLICT", message: "Recurso já existe." },
  "permission-denied": { code: "FORBIDDEN", message: "Permissão negada." },
  unauthenticated: { code: "UNAUTHORIZED", message: "Não autenticado." },
  "invalid-argument": { code: "BAD_REQUEST", message: "Argumento inválido." },
  "deadline-exceeded": {
    code: "INTERNAL_SERVER_ERROR",
    message: "Tempo limite excedido.",
  },
  "resource-exhausted": {
    code: "INTERNAL_SERVER_ERROR",
    message: "Recurso esgotado.",
  },
  "failed-precondition": {
    code: "BAD_REQUEST",
    message: "Pré-condição falhou.",
  },
  aborted: { code: "INTERNAL_SERVER_ERROR", message: "Operação abortada." },
  "out-of-range": { code: "BAD_REQUEST", message: "Fora do intervalo." },
  unimplemented: {
    code: "INTERNAL_SERVER_ERROR",
    message: "Não implementado.",
  },
  internal: { code: "INTERNAL_SERVER_ERROR", message: "Erro interno." },
  unavailable: {
    code: "INTERNAL_SERVER_ERROR",
    message: "Serviço indisponível.",
  },
  "data-loss": { code: "INTERNAL_SERVER_ERROR", message: "Perda de dados." },
};

const isFirebaseError = (
  error: unknown,
): error is { code: string; message: string } => {
  if (!error || typeof error !== "object") return false;
  const e = error as Record<string, unknown>;
  const code = e.code;
  if (typeof code !== "string") return false;
  return (
    code.startsWith("auth/") ||
    code.startsWith("firestore/") ||
    code in firebaseErrorMap
  );
};

export const toAppError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (isFirebaseError(error)) {
    const mapped = firebaseErrorMap[error.code];
    if (mapped) {
      return new AppError({ message: mapped.message, code: mapped.code });
    }
    return new AppError({
      message: error.message ?? "Erro no serviço Firebase.",
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  return new AppError({
    message: "Erro interno do servidor.",
    code: "INTERNAL_SERVER_ERROR",
  });
};
