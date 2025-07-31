import { PrismaClient } from 'prisma-v5_chroniques/v5-chroniques-database-client-types';

const getPrisma = () => new PrismaClient();

const globalV5ChroniquesPrismaClient = global as unknown as {
  v5ChroniquesPrismaClient: ReturnType<typeof getPrisma>;
};

export const v5ChroniquesPrismaClient =
  globalV5ChroniquesPrismaClient.v5ChroniquesPrismaClient || getPrisma();

if (process.env.NODE_ENV !== 'production')
  globalV5ChroniquesPrismaClient.v5ChroniquesPrismaClient =
    v5ChroniquesPrismaClient;
