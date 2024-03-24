import type { Services } from "src/services";

export class JobRunner {
  _services: Services;

  constructor(services: Services) {
    this._services = services;
  }

  queryUserJobs = async (time: Date) => {
    const copiedTime = new Date(time);
    copiedTime.setMinutes(copiedTime.getMinutes(), 0, 0);
    this._services.logger.debug(`The time is ${copiedTime.toLocaleTimeString()}`);
    const usersToNotify = await this._services.db.user.findMany({
      where: {
        preferredUtcTime: copiedTime,
      },
    });
    this._services.logger.debug("users to notify", { count: usersToNotify.length });
  };
}
