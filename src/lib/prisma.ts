import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  const connectionString = process.env.PRISMA_DATABASE_URL;
  if (!connectionString) {
    // Return a client that will fail at query time with a clear error
    // This prevents build-time crashes when env vars aren't set
    const adapter = new PrismaPg({ connectionString: "postgresql://placeholder:5432/placeholder" });
    return new PrismaClient({ adapter });
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
