import { Injectable } from '@nestjs/common';
import { StationsMeteoRepository } from './stations-meteo.repository';
import { DonneesCartesTuilesName } from './stations-meteo.types';
import { FunctionLogger } from 'src/shared/utils';
import { DonneesCartesTuiles } from './stations-meteo.types';

@Injectable()
export class StationsMeteoService {
  private readonly logger = new FunctionLogger(StationsMeteoService.name);
  constructor(
    private readonly stationsMeteoRepository: StationsMeteoRepository,
  ) {}

  async getStationsData({
    name,
    // year,
    // month,
    // day,
    // hour,
  }: {
    name: DonneesCartesTuilesName;
    year: number;
    month: number;
    day: number;
    hour: number;
  }): Promise<DonneesCartesTuiles> {
    const donnees = await this.stationsMeteoRepository.getTemperatures(name);
    if (!donnees) {
      throw new Error('errors.not_found');
    }
    return donnees;
  }
}
