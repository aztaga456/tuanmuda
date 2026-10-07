// Safe Prisma Client singleton with dynamic resolution
let prismaClientInstance: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require("@prisma/client");
  const globalForPrisma = globalThis as unknown as { prisma: any };
  prismaClientInstance =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaClientInstance;
  }
} catch {
  // Fallback if @prisma/client is still compiling or pending generation
  prismaClientInstance = null;
}

export const prisma = prismaClientInstance;
export default prisma;
