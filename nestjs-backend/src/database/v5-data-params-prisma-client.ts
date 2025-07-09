import { PrismaClient } from 'prisma-v5_data_params/v5-data-params-database-client-types';

const getPrisma = () => new PrismaClient();

const globalV5DataParamsPrismaClient = global as unknown as {
  v5DataParamsPrismaClient: ReturnType<typeof getPrisma>;
};

export const v5DataParamsPrismaClient =
  globalV5DataParamsPrismaClient.v5DataParamsPrismaClient || getPrisma();

if (process.env.NODE_ENV !== 'production')
  globalV5DataParamsPrismaClient.v5DataParamsPrismaClient = v5DataParamsPrismaClient;
