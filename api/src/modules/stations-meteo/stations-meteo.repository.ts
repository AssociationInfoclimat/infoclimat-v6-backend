import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { FunctionLogger } from 'src/shared/utils';
import { DonneesCartesTuiles, DonneesCartesTuilesName } from './types';

@Injectable()
export class StationsMeteoRepository {
  constructor(private prisma: PrismaService) {}
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
