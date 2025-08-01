import { Test, TestingModule } from '@nestjs/testing';
import { StationsMeteoService } from './stations-meteo.service';
import { StationsMeteoRepository } from './stations-meteo.repository';
import { MockFactories } from '../../testing/mock-factories';
import {
  TestValidationHelper,
  ExpectedResponses,
} from '../../testing/test-utils';
import { DonneesCartesTuilesName } from './types';

describe('StationsMeteoService', () => {
  let service: StationsMeteoService;
  let mockRepository: jest.Mocked<StationsMeteoRepository>;

  beforeEach(async () => {
    // Create mock repository
    const mockRepositoryProvider = {
      provide: StationsMeteoRepository,
      useValue: {
        getTemperatures: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [StationsMeteoService, mockRepositoryProvider],
    }).compile();

    service = module.get<StationsMeteoService>(StationsMeteoService);
    mockRepository = module.get(StationsMeteoRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStationsData', () => {
    const validParams = {
      name: DonneesCartesTuilesName.TEMPERATURES,
      year: 2024,
      month: 4,
      day: 16,
      hour: 20,
    };

    it('should return stations data when repository returns valid data', async () => {
      // Arrange
      const expectedData = MockFactories.createMockDonneesCartesTuiles();
      mockRepository.getTemperatures.mockResolvedValue(expectedData);

      // Act
      const result = await service.getStationsData(validParams);

      // Assert
      expect(mockRepository.getTemperatures).toHaveBeenCalledTimes(1);
      expect(mockRepository.getTemperatures).toHaveBeenCalledWith(
        DonneesCartesTuilesName.TEMPERATURES,
      );

      expect(result).toEqual(expectedData);
      TestValidationHelper.validateServiceResponse(
        result,
        ExpectedResponses.DonneesCartesTuiles,
      );
    });

    it('should return custom temperature data structure', async () => {
      // Arrange
      const customData = MockFactories.createMockDonneesCartesTuiles({
        year: '2023',
        month: '01',
        day: '15',
        hour: '12',
        minute: '45',
      });
      mockRepository.getTemperatures.mockResolvedValue(customData);

      // Act
      const result = await service.getStationsData(validParams);

      // Assert
      expect(result).toEqual(customData);
      expect(result.year).toBe('2023');
      expect(result.month).toBe('01');
      expect(result.day).toBe('15');
      expect(result.hour).toBe('12');
      expect(result.minute).toBe('45');
    });

    it('should throw error when repository returns null/undefined', async () => {
      // Arrange
      mockRepository.getTemperatures.mockResolvedValue(undefined);

      // Act & Assert
      await expect(service.getStationsData(validParams)).rejects.toThrow(
        'errors.not_found',
      );
      expect(mockRepository.getTemperatures).toHaveBeenCalledTimes(1);
    });

    it('should handle repository errors and re-throw them', async () => {
      // Arrange
      const repositoryError = new Error('Database connection failed');
      mockRepository.getTemperatures.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(service.getStationsData(validParams)).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockRepository.getTemperatures).toHaveBeenCalledTimes(1);
    });
  });
});
