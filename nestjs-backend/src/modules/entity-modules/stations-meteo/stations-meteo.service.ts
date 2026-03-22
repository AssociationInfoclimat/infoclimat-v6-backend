import { Injectable } from '@nestjs/common';
import { StationsMeteoRepository } from './stations-meteo.repository';
import { DonneesCartesTuilesName } from './stations-meteo.types';
import { FunctionLogger } from 'src/shared/utils';
import {
  DonneesCartesTuiles,
  DonneesCartesTuilesWithKey,
} from './stations-meteo.types';
import { md5key } from './stations-meteo.utils';

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

  async getTilesData(): Promise<DonneesCartesTuilesWithKey[]> {
    const tilesData = await this.stationsMeteoRepository.getTilesData();
    return tilesData.map((tile) => ({
      key: md5key({
        param: tile.nom,
        data: {
          year: parseInt(tile.year),
          month: parseInt(tile.month),
          day: parseInt(tile.day),
          hour: parseInt(tile.hour),
        },
      }),
      ...tile,
    }));
  }

  async getTileData(
    nom: DonneesCartesTuilesName,
  ): Promise<DonneesCartesTuilesWithKey | undefined> {
    const tileData = await this.stationsMeteoRepository.getTileData(nom);
    if (!tileData) {
      return undefined;
    }
    return {
      key: md5key({
        param: tileData.nom,
        data: {
          year: parseInt(tileData.year),
          month: parseInt(tileData.month),
          day: parseInt(tileData.day),
          hour: parseInt(tileData.hour),
        },
      }),
      ...tileData,
    };
  }
}
