import { Test, TestingModule } from '@nestjs/testing';
import { DicoService } from './dico.service';
import { DicoRepository } from './dico.repository';
import { MockFactories } from '../../testing/mock-factories';
import {
  TestValidationHelper,
  ExpectedResponses,
} from '../../testing/test-utils';

describe('DicoService', () => {
  let service: DicoService;
  let mockRepository: jest.Mocked<DicoRepository>;

  beforeEach(async () => {
    // Create mock repository
    const mockRepositoryProvider = {
      provide: DicoRepository,
      useValue: {
        getTenRandomLexique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [DicoService, mockRepositoryProvider],
    }).compile();

    service = module.get<DicoService>(DicoService);
    mockRepository = module.get(DicoRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTenRandomLexique', () => {
    it('should return 10 lexique words from repository', async () => {
      // Arrange
      const expectedWords = MockFactories.createMockLexiqueWords(10);
      mockRepository.getTenRandomLexique.mockResolvedValue(expectedWords);

      // Act
      const result = await service.getTenRandomLexique();

      // Assert
      expect(mockRepository.getTenRandomLexique).toHaveBeenCalledTimes(1);
      expect(mockRepository.getTenRandomLexique).toHaveBeenCalledWith();

      expect(result).toEqual(expectedWords);
      expect(result).toHaveLength(10);
      TestValidationHelper.validateArrayObjectsStructure(result, [
        'id',
        'slug',
        'mot',
      ]);

      // Validate each word structure
      result.forEach((word) => {
        expect(word).toMatchObject(ExpectedResponses.LexiqueWord);
      });
    });

    it('should return fewer words if repository returns fewer', async () => {
      // Arrange
      const expectedWords = MockFactories.createMockLexiqueWords(5);
      mockRepository.getTenRandomLexique.mockResolvedValue(expectedWords);

      // Act
      const result = await service.getTenRandomLexique();

      // Assert
      expect(result).toEqual(expectedWords);
      expect(result).toHaveLength(5);
      TestValidationHelper.validateArrayObjectsStructure(result, [
        'id',
        'slug',
        'mot',
      ]);
    });

    it('should return empty array when repository returns empty array', async () => {
      // Arrange
      mockRepository.getTenRandomLexique.mockResolvedValue([]);

      // Act
      const result = await service.getTenRandomLexique();

      // Assert
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('should handle repository errors and re-throw them', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed');
      mockRepository.getTenRandomLexique.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(service.getTenRandomLexique()).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockRepository.getTenRandomLexique).toHaveBeenCalledTimes(1);
    });
  });
});
