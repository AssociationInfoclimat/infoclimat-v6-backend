/**
 * Prisma mock factory utilities
 * Provides consistent mocking patterns for different Prisma clients
 */

export class PrismaMockFactory {
  /**
   * Creates a mock Prisma client with common methods
   */
  static createBasePrismaClientMock() {
    return {
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      $executeRaw: jest.fn(),
      $queryRaw: jest.fn(),
      $transaction: jest.fn(),
    };
  }

  /**
   * Creates a mock for the V5 Data Params Prisma client
   */
  static createV5DataParamsPrismaClientMock() {
    return {
      ...PrismaMockFactory.createBasePrismaClientMock(),
      cartes_tuiles: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        upsert: jest.fn(),
        count: jest.fn(),
      },
    };
  }

  /**
   * Creates a mock for the Dico Prisma client
   */
  static createDicoPrismaClientMock() {
    return {
      ...PrismaMockFactory.createBasePrismaClientMock(),
      lexique: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        upsert: jest.fn(),
        count: jest.fn(),
      },
    };
  }

  /**
   * Creates a mock for the V5 Prisma client
   */
  static createV5PrismaClientMock() {
    return {
      ...PrismaMockFactory.createBasePrismaClientMock(),
      // Add specific V5 database models as needed
      stations: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        upsert: jest.fn(),
        count: jest.fn(),
      },
    };
  }

  /**
   * Creates a mock for the V5 Chroniques Prisma client
   */
  static createV5ChroniquesPrismaClientMock() {
    return {
      ...PrismaMockFactory.createBasePrismaClientMock(),
      chroniques: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        upsert: jest.fn(),
        count: jest.fn(),
      },
    };
  }

  /**
   * Creates a mock for the V5 Prevs Prisma client
   */
  static createV5PrevsPrismaClientMock() {
    return {
      ...PrismaMockFactory.createBasePrismaClientMock(),
      previsions: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        upsert: jest.fn(),
        count: jest.fn(),
      },
    };
  }

  /**
   * Creates a mock for the V5 Photolive Prisma client
   */
  static createV5PhotolivePrismaClientMock() {
    return {
      ...PrismaMockFactory.createBasePrismaClientMock(),
      photos: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        upsert: jest.fn(),
        count: jest.fn(),
      },
    };
  }
}
