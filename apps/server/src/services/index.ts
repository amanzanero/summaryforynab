import type { PrismaClient } from "@prisma/client";
import { Logger as WinstonLogger } from "winston";
import { api } from "ynab";
import type { ServerEnvironment } from "./env";

export interface Services {
  db: PrismaClient;
  logger: WinstonLogger;
  ynabApi: api;
  env: ServerEnvironment;
}
