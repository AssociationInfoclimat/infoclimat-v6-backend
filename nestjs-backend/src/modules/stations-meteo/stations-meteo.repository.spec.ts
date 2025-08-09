import { Test, TestingModule } from '@nestjs/testing';
import { StationsMeteoRepository } from './stations-meteo.repository';
import { MockFactories } from '../../testing/mock-factories';
import {
  TestValidationHelper,
  ExpectedResponses,
} from '../../testing/test-utils';
import { DonneesCartesTuilesName } from './types';

// Mock the Prisma client module
jest.mock('../../database/v5-data-params-prisma-client', () => ({
  v5DataParamsPrismaClient: {
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
  },
}));

describe('StationsMeteoRepository', () => {
  let repository: StationsMeteoRepository;
  let mockPrismaClient: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StationsMeteoRepository],
    }).compile();

    repository = module.get<StationsMeteoRepository>(StationsMeteoRepository);

    // Get the mocked prisma client
    mockPrismaClient =
      require('../../database/v5-data-params-prisma-client').v5DataParamsPrismaClient;

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('getTemperatures', () => {
    it('should return parsed temperature data when record exists', async () => {
      // Arrange
      const expectedData = MockFactories.createMockDonneesCartesTuiles();
      const mockRecord = MockFactories.createMockCartesTuilesRecord({
        nom: DonneesCartesTuilesName.TEMPERATURES,
        donnees: expectedData,
      });

      mockPrismaClient.cartes_tuiles.findUnique.mockResolvedValue(mockRecord);

      // Act
      const result = await repository.getTemperatures(
        DonneesCartesTuilesName.TEMPERATURES,
      );

      // Assert
      expect(mockPrismaClient.cartes_tuiles.findUnique).toHaveBeenCalledTimes(
        1,
      );
      expect(mockPrismaClient.cartes_tuiles.findUnique).toHaveBeenCalledWith({
        where: { nom: DonneesCartesTuilesName.TEMPERATURES },
      });

      expect(result).toEqual(expectedData);
      TestValidationHelper.validateServiceResponse(
        result,
        ExpectedResponses.DonneesCartesTuiles,
      );
    });

    it('should return undefined when record does not exist', async () => {
      // Arrange
      mockPrismaClient.cartes_tuiles.findUnique.mockResolvedValue(null);

      // Act
      const result = await repository.getTemperatures(
        DonneesCartesTuilesName.TEMPERATURES,
      );

      // Assert
      expect(mockPrismaClient.cartes_tuiles.findUnique).toHaveBeenCalledTimes(
        1,
      );
      expect(result).toBeUndefined();
    });

    it('should handle JSON parsing correctly for valid data', async () => {
      // Arrange
      const expectedData = MockFactories.createMockDonneesCartesTuiles({
        year: '2023',
        month: '12',
        day: '25',
        hour: '15',
        minute: '30',
      });
      const mockRecord = MockFactories.createMockCartesTuilesRecord({
        donnees: expectedData,
      });

      mockPrismaClient.cartes_tuiles.findUnique.mockResolvedValue(mockRecord);

      // Act
      const result = await repository.getTemperatures(
        DonneesCartesTuilesName.TEMPERATURES,
      );

      // Assert
      expect(result).toEqual(expectedData);
      expect(result?.year).toBe('2023');
      expect(result?.month).toBe('12');
      expect(result?.day).toBe('25');
      expect(result?.hour).toBe('15');
      expect(result?.minute).toBe('30');
    });

    it('should throw error when database query fails', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockPrismaClient.cartes_tuiles.findUnique.mockRejectedValue(dbError);

      // Act & Assert
      await expect(
        repository.getTemperatures(DonneesCartesTuilesName.TEMPERATURES),
      ).rejects.toThrow('Database connection failed');

      expect(mockPrismaClient.cartes_tuiles.findUnique).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should handle malformed JSON data gracefully', async () => {
      // Arrange
      const mockRecord = {
        ...MockFactories.createMockCartesTuilesRecord(),
        donnees: 'invalid-json-string',
      };
      mockPrismaClient.cartes_tuiles.findUnique.mockResolvedValue(mockRecord);

      // Act & Assert
      await expect(
        repository.getTemperatures(DonneesCartesTuilesName.TEMPERATURES),
      ).rejects.toThrow();
    });
  });
});
