import { serverEnvironment } from "./env";
import { getYnabApi } from "./ynabApi";

const setup = async () => {
  console.log("Setting up...", { serverEnvironment });
  return {
    ynabApi: getYnabApi(serverEnvironment.YNAP_PAT),
  };
};

const main = async () => {
  const { ynabApi } = await setup();

  const user = await ynabApi.user.getUser();

  console.log("User", user.data.user);

  // const now = new Date();
  // const seconds = now.getSeconds();
  // const milliseconds = now.getMilliseconds();
  // const delay = (60 - seconds) * 1000 - milliseconds;

  // setTimeout(() => {
  //   setInterval(() => {
  //     console.log("It is exactly :00 seconds!");
  //     console.log(`The time is ${new Date().toLocaleTimeString()}`);
  //   }, 60000);
  // }, delay);
};

const cleanup = () => {
  console.log("Cleaning up...");
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

main();
