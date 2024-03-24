import { PrismaClient } from "@repo/data";
import { serverEnvironment } from "./env";

export const createPrismaClient = () =>
  new PrismaClient({
    log:
      serverEnvironment.NODE_ENV === "development" ? ["query", "error", "warn", "info"] : ["error"],
  });
