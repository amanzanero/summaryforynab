import type { Services } from "./services";

export const seedInitialUser = async (services: Services) => {
  const logger = services.logger.child({ module: "seed" });
  const user = await services.ynabApi(services.env.YNAP_PAT).user.getUser();
  logger.debug("updating user...");
  const now = new Date();
  now.setMinutes(now.getMinutes(), 0, 0);
  logger.debug(`next whole minute mark ${now.toISOString()}`);
  const res = await services.db.user.upsert({
    where: { ynabId: user.data.user.id },
    create: {
      ynabId: user.data.user.id,
      preferredUtcTime: now,
      email: "info@amanzanero.com",
      emailVerified: true,
    },
    update: {
      // 1 min from now
      preferredUtcTime: now,
    },
  });
  logger.debug("upserted user", res);
};
