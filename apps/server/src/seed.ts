import type { Services } from "./services";

export const seedInitialUser = async (services: Services) => {
  if (services.env.NODE_ENV === "development") {
    const logger = services.logger.child({ module: "seed" });
    const user = await services.ynabApi.user.getUser();
    logger.debug("updating user...");
    // exactly 1 minute from now at the :00 second
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1, 0, 0);
    logger.debug(`next whole minute mark ${now.toISOString()}`);
    const res = await services.db.user.upsert({
      where: { ynabId: user.data.user.id },
      create: {
        ynabId: user.data.user.id,
        preferredUtcTime: now,
      },
      update: {
        // 1 min from now
        preferredUtcTime: now,
      },
    });
    logger.debug("upserted user", res);
  }
};
