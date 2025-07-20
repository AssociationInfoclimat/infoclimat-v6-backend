import { PrismaClient } from 'prisma-v5_photolive/v5-photolive-database-client-types';

const getPrisma = () => new PrismaClient();

const globalV5PhotolivePrismaClient = global as unknown as {
  v5PhotolivePrismaClient: ReturnType<typeof getPrisma>;
};

export const v5PhotolivePrismaClient =
  globalV5PhotolivePrismaClient.v5PhotolivePrismaClient || getPrisma();

if (process.env.NODE_ENV !== 'production')
  globalV5PhotolivePrismaClient.v5PhotolivePrismaClient =
    v5PhotolivePrismaClient;
