import type { Services } from "src/services";

export const intervalWithInitialDelay = (
  services: Services,
  action: () => unknown,
) => {
  // set delay to the next whole minute, dont delay in dev
  const delay = 60000 - (Date.now() % 60000);
  const interval = 60000;
  if (services.env.NODE_ENV === "development") {
    action();
  } else {
    services.logger.info(`delaying first run for ${delay / 1000}s`);
  }

  setTimeout(() => {
    action();
    setInterval(() => {
      action();
    }, interval);
  }, delay);
};
