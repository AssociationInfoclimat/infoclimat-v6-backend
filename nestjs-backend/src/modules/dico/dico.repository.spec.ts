import { Test, TestingModule } from '@nestjs/testing';
import { DicoRepository } from './dico.repository';
import { MockFactories } from '../../testing/mock-factories';
import {
  TestValidationHelper,
  ExpectedResponses,
} from '../../testing/test-utils';

// Mock the Prisma client module
jest.mock('../../database/dico-prisma-client', () => ({
  dicoPrismaClient: {
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
  },
}));

describe('DicoRepository', () => {
  let repository: DicoRepository;
  let mockPrismaClient: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DicoRepository],
    }).compile();

    repository = module.get<DicoRepository>(DicoRepository);

    // Get the mocked prisma client
    mockPrismaClient =
      require('../../database/dico-prisma-client').dicoPrismaClient;

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('getTenRandomLexique', () => {
    it('should return 10 mapped lexique words', async () => {
      // Arrange
      const mockRecords = MockFactories.createMockLexiqueRecords(10);

      mockPrismaClient.lexique.findMany.mockResolvedValue(mockRecords);

      // Act
      const result = await repository.getTenRandomLexique();

      // Assert
      expect(mockPrismaClient.lexique.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrismaClient.lexique.findMany).toHaveBeenCalledWith({
        where: { valide: 1 },
        orderBy: { id: 'asc' },
        take: 10,
      });

      expect(result).toHaveLength(10);
      TestValidationHelper.validateArrayObjectsStructure(result, [
        'id',
        'slug',
        'mot',
      ]);

      // Validate structure of each result matches expected format
      result.forEach((word, index) => {
        expect(word).toMatchObject(ExpectedResponses.LexiqueWord);
        expect(word.id).toBe(mockRecords[index].id);
        expect(typeof word.slug).toBe('string');
        expect(typeof word.mot).toBe('string');
        // Check that first letter is capitalized
        expect(word.mot[0]).toBe(word.mot[0].toUpperCase());
      });
    });

    it('should return fewer than 10 words if database has fewer records', async () => {
      // Arrange
      const mockRecords = MockFactories.createMockLexiqueRecords(5);
      mockPrismaClient.lexique.findMany.mockResolvedValue(mockRecords);

      // Act
      const result = await repository.getTenRandomLexique();

      // Assert
      expect(result).toHaveLength(5);
      TestValidationHelper.validateArrayObjectsStructure(result, [
        'id',
        'slug',
        'mot',
      ]);
    });

    it('should return empty array when no records found', async () => {
      // Arrange
      mockPrismaClient.lexique.findMany.mockResolvedValue([]);

      // Act
      const result = await repository.getTenRandomLexique();

      // Assert
      expect(result).toHaveLength(0);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should throw error when database query fails', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockPrismaClient.lexique.findMany.mockRejectedValue(dbError);

      // Act & Assert
      await expect(repository.getTenRandomLexique()).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockPrismaClient.lexique.findMany).toHaveBeenCalledTimes(1);
    });
  });
});
