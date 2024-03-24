import express from "express";
import { createPrismaClient } from "./services/data";
import { serverEnvironment } from "./services/env";
import { getYnabApi } from "./services/ynabApi";
import { makeLogger } from "./services/logger";
import type { Services } from "./services";
import { queryUserJobs } from "./jobs/jobs";
import { seedInitialUser } from "./seed";

const setup: () => Promise<Services> = async () => {
  const db = createPrismaClient();
  await db.$connect();
  const ynabApi = getYnabApi(serverEnvironment.YNAP_PAT);
  return { db, env: serverEnvironment, logger: makeLogger(), ynabApi };
};

const services = await setup();

const main = async (services: Services) => {
  if (services.env.NODE_ENV === "development") {
    await seedInitialUser(services);
  }

  /**
   * Query all user jobs every minute
   */

  // set delay to the next whole minute
  const delay = 60000 - (Date.now() % 60000);
  services.logger.debug(`delaying ${delay}ms`);
  setTimeout(() => {
    queryUserJobs(new Date(), services);
    setInterval(() => {
      queryUserJobs(new Date(), services);
    }, 60000);
  }, delay);

  services.logger.info("periodic job started");
};

const app = express();

app.get("/health", (req, res) => {
  services.logger.info("responding OK to health check");
  res.send("ok");
});

main(services);

const server = app.listen(serverEnvironment.PORT, () => {
  services.logger.info(`Server listening on port ${serverEnvironment.PORT}`);
});

let shutdown = false;
const cleanup = async () => {
  if (shutdown) {
    services.logger.info("Already shutting down...");
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
