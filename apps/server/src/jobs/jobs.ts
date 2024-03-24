import { nanoid } from "nanoid";
import { Logger as WinstonLogger } from "winston";
import type { Sender } from "src/sender/sender";
import type { Services } from "src/services";

export class JobRunner {
  private servcies: Services;
  private logger: WinstonLogger;
  private sender: Sender;
  private running = false;

  constructor(services: Services, sender: Sender) {
    this.servcies = services;
    this.logger = services.logger.child({ module: "JobRunner" });
    this.sender = sender;
  }

  private updateLoggerForNewRun = () => {
    this.logger = this.servcies.logger.child({ module: "JobRunner", runId: nanoid() });
  };

  private queryUserJobs = async (time: Date) => {
    const copiedTime = new Date(time);
    copiedTime.setMinutes(copiedTime.getMinutes(), 0, 0);
    this.logger.debug(`the time is ${copiedTime.toLocaleTimeString()}`);
    const usersToNotify = await this.servcies.db.user.findMany({
      where: {
        preferredUtcTime: copiedTime,
      },
    });
    this.logger.debug("users to notify", { count: usersToNotify.length });
    return usersToNotify;
  };

  run = async () => {
    if (this.running) {
      this.logger.warn("job is already running");
      return;
    } else {
      this.running = true;
    }
    this.updateLoggerForNewRun();

    this.logger.info("starting...");
    const now = new Date();
    const usersToNotify = await this.queryUserJobs(now);
    const results = await Promise.allSettled(
      usersToNotify.reduce<Promise<void>[]>((acc, user) => {
        if (user.emailVerified) {
          acc.push(this.sender.send(user.email, "this is a test email"));
        }
        return acc;
      }, [])
    );
    const erroredEmails = results.filter(
      (result): result is PromiseRejectedResult => result.status === "rejected"
    );
    if (erroredEmails.length > 0) {
      this.logger.error("failed to send emails", { count: erroredEmails.length });
      for (const error of erroredEmails) {
        this.logger.error("failed to send email", { error: error.reason });
      }
    }

    this.logger.debug("finished");
    this.running = false;
  };
}
