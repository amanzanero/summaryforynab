import type { User } from "@repo/data";
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
    this.logger.info("users to notify", { count: usersToNotify.length });
    return usersToNotify;
  };

  private generateMessageForUser = async (user: User) => {
    const api = this.servcies.ynabApi(this.servcies.env.YNAP_PAT);
    const budget = await api.budgets.getBudgets();
    return `Hello ${user.email}, you have ${budget.data.budgets.length} budgets`;
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
    // TODO: update this block when ready to run in production
    if (this.servcies.env.NODE_ENV !== "development") {
      this.logger.warn("not running in development, exiting");
      this.running = false;
      return;
    }

    const now = new Date();
    const usersToNotify = await this.queryUserJobs(now);
    const results = await Promise.allSettled(
      usersToNotify.reduce<Promise<void>[]>((acc, user) => {
        if (user.emailVerified) {
          acc.push(
            (async () => {
              const message = await this.generateMessageForUser(user);
              await this.sender.send(user.email, message);
            })()
          );
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

    this.logger.info("finished");
    this.running = false;
  };
}
