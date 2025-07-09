import { Injectable } from '@nestjs/common';
import { FunctionLogger } from 'src/shared/utils';
import { DonneesCartesTuiles, DonneesCartesTuilesName } from './types';
import { v5DataParamsPrismaClient } from 'src/database/v5-data-params-prisma-client';

@Injectable()
export class StationsMeteoRepository {
  private prisma = v5DataParamsPrismaClient;

  constructor() {}
  private readonly logger = new FunctionLogger(StationsMeteoRepository.name);

  async getTemperatures(
    nom: DonneesCartesTuilesName,
  ): Promise<DonneesCartesTuiles | undefined> {
    try {
      const cartesTuiles = await this.prisma.cartes_tuiles.findUnique({
        where: { nom: nom as string },
      });
      if (!cartesTuiles) {
        return undefined;
      }
      const data = JSON.parse(cartesTuiles.donnees) as DonneesCartesTuiles;
      return data;
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
