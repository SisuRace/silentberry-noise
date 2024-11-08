import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  db: PrismaClient | undefined; // 改 prisma 为 db
};

export const db = // 改 prisma 为 db
  globalForPrisma.db ?? // 改 prisma 为 db
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.db = db; // 改 prisma 为 db
