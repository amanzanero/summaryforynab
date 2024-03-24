import type { Services } from "src/services";

export const queryUserJobs = async (time: Date, services: Services) => {
  const copiedTime = new Date(time);
  copiedTime.setMinutes(copiedTime.getMinutes(), 0, 0);
  services.logger.debug(`The time is ${copiedTime.toLocaleTimeString()}`);
  const usersToNotify = await services.db.user.findMany({
    where: {
      preferredUtcTime: copiedTime,
    },
  });
  services.logger.debug("Users to notify", { count: usersToNotify.length });
};
