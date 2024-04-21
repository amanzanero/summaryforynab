/**
 * Contains the logic for querying which users should receive an email, aggregating
 * the information, formatting the email, and sending the email.
 */
import { nanoid } from "nanoid";
import { Logger as WinstonLogger } from "winston";
import type { Sender } from "src/sender/sender";
import type { Services } from "src/services";
import { YnabStore } from "./ynabStore";

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
      usersToNotify
        .filter((user) => user.emailVerified)
        .map((user) => this.fetchAndSend(user)),
    );
    const erroredEmails = results.filter(
      (result) => result.status === "rejected",
    );
    if (erroredEmails.length > 0) {
      this.logger.error(`failed to send ${erroredEmails.length} emails`);
    }

    this.logger.info("finished");
    this.running = false;
  };

  private updateLoggerForNewRun = () => {
    this.logger = this.servcies.logger.child({
      module: "JobRunner",
      runId: nanoid(),
    });
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

  private fetchAndSend = async (user: { id: number; email: string }) => {
    const userLogger = this.logger.child({ userId: user.id });
    const budgetInfo = await new YnabStore(
      this.servcies.ynabApi(this.servcies.env.YNAP_PAT),
    )
      .getBudgetGroupsForUser()
      .catch((error) => {
        userLogger.error("failed to get budget groups", { error });
        throw error;
      });
    await this.sender.send(user.email, budgetInfo).catch((error) => {
      userLogger.error("failed to send email", { error });
      throw error;
    });
  };
}
