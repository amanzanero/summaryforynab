import express from "express";
import { serverEnvironment } from "./services/env";
import { getOrCreateServices, type Services } from "./services";
import { JobRunner } from "./jobs/jobs";
import { seedInitialUser } from "./seed";
import { Process } from "./services/status";

const main = async (services: Services) => {
  if (services.env.NODE_ENV === "development") {
    await seedInitialUser(services);
  }

  /**
   * Query all user jobs every minute
   */
  const jobRunner = new JobRunner(services);

  // set delay to the next whole minute
  const delay = 60000 - (Date.now() % 60000);
  services.logger.debug(`delaying ${delay}ms`);
  setTimeout(() => {
    if (services.status.ready()) {
      jobRunner.queryUserJobs(new Date());
    } else {
      services.logger.warn("services not ready, not starting periodic job");
    }
    setInterval(() => {
      if (services.status.ready()) {
        jobRunner.queryUserJobs(new Date());
      } else {
        services.logger.warn("services not ready, not starting periodic job");
      }
    }, 60000);
  }, delay);

  services.logger.info("periodic job started");
  services.status.registerProcessReady(Process.JobRunner);
};

const app = express();

app.get("/healthz", async (req, res) => {
  const services = await getOrCreateServices();
  if (!services.status.processesReady()) {
    services.logger.info("processes are not ready, responding with 503");
    res.status(503).send("service unavailable");
  } else {
    services.status.registerHealthCheckReady();
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
    services.db.$disconnect().then(() => services.logger.info("disconnected from db")),
    new Promise<void>((resolve, reject) =>
      server.close((err) => {
        if (err) {
          reject(err);
        }
        resolve();
      })
    ).then(() => services.logger.info("http server closed")),
  ]);
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
