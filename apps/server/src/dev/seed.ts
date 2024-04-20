import type { Services } from "src/services";

export const seedInitialUser = async (services: Services) => {
  const logger = services.logger.child({ module: "seed" });
  const user = await services
    .ynabApi(services.env.YNAP_PAT)
    .user.getUser()
    .catch((e) => {
      logger.error(e);
    });
  if (!user) return;
  logger.debug("updating user...");
  const now = new Date();
  now.setMinutes(now.getMinutes(), 0, 0);
  const res = await services.db.user
    .upsert({
      where: { ynabId: user.data.user.id },
      create: {
        ynabId: user.data.user.id,
        preferredUtcTime: now,
        email: "info@amanzanero.com",
        emailVerified: true,
      },
      update: {
        preferredUtcTime: now,
        email: "info@amanzanero.com",
      },
    })
    .catch((e) => {
      return e;
    });
  if (res) {
    logger.debug("upserted user", res);
  }
};
