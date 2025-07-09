import { PrismaClient } from 'prisma-v5/v5-database-client-types';

const getPrisma = () => new PrismaClient();

const globalV5DBPrismaClient = global as unknown as {
  v5DBPrismaClient: ReturnType<typeof getPrisma>;
};

export const v5DBPrismaClient =
  globalV5DBPrismaClient.v5DBPrismaClient || getPrisma();

if (process.env.NODE_ENV !== 'production')
  globalV5DBPrismaClient.v5DBPrismaClient = v5DBPrismaClient;
