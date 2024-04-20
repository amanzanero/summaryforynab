import type { api } from "ynab";
import { Logger as WinstonLogger } from "winston";
import type { ServerEnvironment } from "./env";
import type { ProcessStatus } from "./status";
import { createPrismaClient } from "./data";
import { serverEnvironment } from "./env";
import { getYnabApi } from "./ynabApi";
import { makeLogger } from "./logger";
import { ProcessStatusImpl } from "./status";
import type { PrismaClient } from "@repo/data";

export interface Services {
  db: PrismaClient;
  logger: WinstonLogger;
  ynabApi(token: string): api;
  env: ServerEnvironment;
  status: ProcessStatus;
}

let _services: Services | undefined;
export const getOrCreateServices: () => Promise<Services> = async () => {
  if (_services) {
    return _services;
  }
  const db = createPrismaClient();
  await db.$connect();
  const services = {
    db,
    env: serverEnvironment,
    logger: makeLogger(),
    ynabApi: getYnabApi,
    status: new ProcessStatusImpl(serverEnvironment),
  };
  _services = services;
  return services;
};
