import { app } from "./app";
import { env } from "./config/env";
import { firestore } from "./lib/database";

const SHUTDOWN_TIMEOUT_MS = 10_000;

let isShuttingDown = false;

const shutdown = async (signal: string) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`[SHUTDOWN] Sinal ${signal} recebido, encerrando o servidor...`);

  const forceExitTimer = setTimeout(() => {
    console.error("[SHUTDOWN] Tempo limite excedido, forçando encerramento.");
    process.exit(1);
  }, SHUTDOWN_TIMEOUT_MS);

  forceExitTimer.unref();

  try {
    await app.close();
    console.log("[SHUTDOWN] Servidor HTTP encerrado.");

    await firestore.terminate();
    console.log("[SHUTDOWN] Conexão com o Firestore encerrada.");

    clearTimeout(forceExitTimer);
    process.exit(0);
  } catch (error) {
    console.error("[SHUTDOWN] Erro ao encerrar o servidor:", error);
    clearTimeout(forceExitTimer);
    process.exit(1);
  }
};

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));

app
  .listen({ port: env.PORT, host: env.HOST })
  .then(() => {
    console.log(`Server is running on port ${env.PORT}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
