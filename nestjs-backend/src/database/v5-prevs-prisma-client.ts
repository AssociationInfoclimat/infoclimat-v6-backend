import { PrismaClient } from 'prisma-v5_prevs/v5-prevs-database-client-types';

const getPrisma = () => new PrismaClient();

const globalV5PrevsPrismaClient = global as unknown as {
  v5PrevsPrismaClient: ReturnType<typeof getPrisma>;
};

export const v5PrevsPrismaClient =
  globalV5PrevsPrismaClient.v5PrevsPrismaClient || getPrisma();

if (process.env.NODE_ENV !== 'production')
  globalV5PrevsPrismaClient.v5PrevsPrismaClient = v5PrevsPrismaClient;
