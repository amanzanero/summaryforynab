import type { Services } from "src/services";

export const intervalWithInitialDelay = (
  services: Services,
  action: () => unknown,
) => {
  // set delay to the next whole minute in dev, next whole hour in prod
  let delay: number;
  let interval: number;
  if (services.env.NODE_ENV === "development") {
    delay = 0;
    interval = 60000;
  } else {
    delay = 3600000 - (Date.now() % 3600000);
    interval = 3600000;
  }
  services.logger.info(`delaying first run for ${delay / 1000}s`);

  setTimeout(() => {
    action();
    setInterval(() => {
      action();
    }, interval);
  }, delay);
};
