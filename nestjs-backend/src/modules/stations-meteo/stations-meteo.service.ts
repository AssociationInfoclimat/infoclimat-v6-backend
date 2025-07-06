import { Injectable } from '@nestjs/common';
import { StationsMeteoRepository } from './stations-meteo.repository';
import { DonneesCartesTuilesName } from './types';
import { FunctionLogger } from 'src/shared/utils';

@Injectable()
export class StationsMeteoService {
  private readonly logger = new FunctionLogger(StationsMeteoService.name);
  constructor(
    private readonly stationsMeteoRepository: StationsMeteoRepository,
  ) {}

  async getStationsData({
    name,
    year,
    month,
    day,
    hour,
  }: {
    name: DonneesCartesTuilesName;
    year: number;
    month: number;
    day: number;
    hour: number;
  }) {
    try {
      const donnees = await this.stationsMeteoRepository.getTemperatures(name);
      if (!donnees) {
        throw new Error('errors.not_found');
      }
      return donnees;
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
