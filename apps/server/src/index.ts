import express from "express";
import { serverEnvironment } from "./services/env";
import { getOrCreateServices, type Services } from "./services";
import { JobRunner } from "./jobRunner";
import { seedInitialUser } from "./seed";
import { Process } from "./services/status";
import { TestEmailSender } from "./sender/testEmailSender";

const main = async (services: Services) => {
  if (services.env.NODE_ENV === "development") {
    await seedInitialUser(services);
  }

  const jobRunner = new JobRunner(
    services,
    new TestEmailSender({
      user: services.env.EMAIL_USER,
      pass: services.env.EMAIL_PASS,
      services,
    }),
  );

  // set delay to the next whole minute in dev, next whole hour in prod
  let delay: number;
  let timeout: number;
  if (services.env.NODE_ENV === "development") {
    delay = 0;
    timeout = 60000;
  } else {
    delay = 3600000 - (Date.now() % 3600000);
    timeout = 3600000;
  }
  services.logger.info(`delaying first run for ${delay / 1000}s`);
  setTimeout(() => {
    if (services.status.ready()) {
      jobRunner.run();
    } else {
      services.logger.warn("services not ready, not starting periodic job");
    }
    setInterval(() => {
      if (services.status.ready()) {
        jobRunner.run();
      } else {
        services.logger.warn("services not ready, not starting periodic job");
      }
    }, timeout);
  }, delay);

  services.logger.info("periodic job started");
  services.status.registerProcessReady(Process.JobRunner);
};

const app = express();

app.get("/healthz", async (_req, res) => {
  const services = await getOrCreateServices();
  if (!services.status.processesReady()) {
    services.logger.info("processes are not ready, responding with 503");
    res.status(503).send("service unavailable");
  } else {
    services.logger.info("responding OK to health check");
    res.status(200).send("ok");
  }
});

main(await getOrCreateServices());

const server = app.listen(serverEnvironment.PORT, async () => {
  const services = await getOrCreateServices();
  services.logger.info(`Server listening on port ${serverEnvironment.PORT}`);
  services.status.registerProcessReady(Process.Server);
});

let shutdown = false;
const cleanup = async () => {
  const services = await getOrCreateServices();
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
