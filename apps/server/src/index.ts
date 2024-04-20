import express from "express";
import { serverEnvironment } from "./services/env";
import { getOrCreateServices } from "./services";
import { Process } from "./services/status";
import { setupIntervalJob } from "./scheduler";

// Setup and config

// blocking call that'll connect with DB and other services
const services = await getOrCreateServices();

const app = express();

app.get("/healthz", async (_req, res) => {
  if (!services.status.processesReady()) {
    services.logger.info("processes are not ready, responding with 503");
    res.status(503).send("service unavailable");
  } else {
    services.logger.info("responding OK to health check");
    res.status(200).send("ok");
  }
});

// Start runner and server

setupIntervalJob(services);

const server = app.listen(serverEnvironment.PORT, async () => {
  services.logger.info(`Server listening on port ${serverEnvironment.PORT}`);
  services.status.registerProcessReady(Process.Server);
});

// Cleanup

let shutdown = false;
const cleanup = async () => {
  if (shutdown) {
    services.logger.info("already shutting down...");
    return;
  }
  shutdown = true;
  services.logger.info("cleaning up...");
  await Promise.allSettled([
    services.db
      .$disconnect()
      .then(() => services.logger.info("disconnected from db")),
    new Promise<void>((resolve, reject) =>
      server.close((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      }),
    ).then(() => services.logger.info("http server closed")),
  ]);
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
