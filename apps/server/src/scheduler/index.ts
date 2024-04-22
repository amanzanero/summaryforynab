import type { Services } from "src/services";
import { JobRunner } from "./jobRunner";
import { TestEmailSender } from "src/sender/testEmailSender";
import { seedInitialUser } from "src/dev/seed";
import { intervalWithInitialDelay } from "./intervalWithInitialDelay";
import { Process } from "src/services/status";

export const setupIntervalJob = async (services: Services) => {
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

  intervalWithInitialDelay(services, () => {
    if (services.status.ready() || services.env.NODE_ENV === "development") {
      jobRunner.run();
    } else {
      services.logger.warn("services not ready, not starting periodic job");
    }
  });

  services.logger.info("periodic job started");
  services.status.registerProcessReady(Process.JobRunner);
};
