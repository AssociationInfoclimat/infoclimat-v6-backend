import { PrismaClient } from 'prisma-dico/dico-database-client-types';

const getPrisma = () => new PrismaClient();

const globalDicoPrismaClient = global as unknown as {
  dicoPrismaClient: ReturnType<typeof getPrisma>;
};

export const dicoPrismaClient =
  globalDicoPrismaClient.dicoPrismaClient || getPrisma();

if (process.env.NODE_ENV !== 'production')
  globalDicoPrismaClient.dicoPrismaClient = dicoPrismaClient;
