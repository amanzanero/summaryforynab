import { PrismaClient } from "@repo/data";
import { serverEnvironment } from "./env";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      serverEnvironment.NODE_ENV === "development" ? ["query", "error", "warn", "info"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (serverEnvironment.NODE_ENV !== "production") globalForPrisma.prisma = db;
