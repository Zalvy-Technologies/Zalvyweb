import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma Client Singleton
 * 
 * Creates a single instance of PrismaClient to avoid connection pool exhaustion
 * in serverless environments. Uses globalThis to persist across hot reloads.
 * Uses the PostgreSQL driver adapter for Prisma 7+.
 * 
 * @module lib/prisma
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use a dummy DATABASE_URL during build if not provided
const databaseUrl = process.env.DATABASE_URL ?? "postgresql://dummy:dummy@localhost:5432/dummy?schema=public";

const createPrismaClient = () => {
  const adapter = new PrismaPg({ connectionString: databaseUrl });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;