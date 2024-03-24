import type { PrismaClient } from "@prisma/client";
import { Logger as WinstonLogger } from "winston";
import { api } from "ynab";
import type { ServerEnvironment } from "./env";
import type { ProcessStatus } from "./status";
import { createPrismaClient } from "./data";
import { serverEnvironment } from "./env";
import { getYnabApi } from "./ynabApi";
import { makeLogger } from "./logger";
import { ProcessStatusImpl } from "./status";

export interface Services {
  db: PrismaClient;
  logger: WinstonLogger;
  ynabApi: api;
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
  const ynabApi = getYnabApi(serverEnvironment.YNAP_PAT);
  const services = {
    db,
    env: serverEnvironment,
    logger: makeLogger(),
    ynabApi,
    status: new ProcessStatusImpl(serverEnvironment),
  };
  _services = services;
  return services;
};
