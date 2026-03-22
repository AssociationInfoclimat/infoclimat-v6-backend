import { Injectable } from '@nestjs/common';
import { FunctionLogger } from 'src/shared/utils';
import {
  DonneesCartesTuiles,
  DonneesCartesTuilesName,
  DonneesCartesTuilesWithNom,
} from './stations-meteo.types';
//
// CAUTION:
//
// `cartes_tuiles` table is in `v5_data_params` database
import { v5DataParamsPrismaClient } from 'src/database/v5-data-params-prisma-client';
//
// `cartes_tuiles` table is in `v5` database
import { v5DBPrismaClient } from 'src/database/v5-prisma-client';
//

@Injectable()
export class StationsMeteoRepository {
  private readonly v5Prisma = v5DBPrismaClient;
  private readonly v5DataParamsPrisma = v5DataParamsPrismaClient;

  constructor() {}
  private readonly logger = new FunctionLogger(StationsMeteoRepository.name);

  async getTemperatures(
    nom: DonneesCartesTuilesName,
  ): Promise<DonneesCartesTuiles | undefined> {
    const cartesTuiles = await this.v5DataParamsPrisma.cartes_tuiles.findUnique(
      {
        where: { nom: nom as string },
      },
    );
    if (!cartesTuiles) {
      return undefined;
    }
    const data = JSON.parse(cartesTuiles.donnees) as DonneesCartesTuiles;
    return data;
  }

  // Was `function jsontiles_get_all($lnk)` in php
  async getTilesData(): Promise<DonneesCartesTuilesWithNom[]> {
    const cartesTuiles = await this.v5Prisma.cartes_tuiles.findMany();
    return cartesTuiles.map((cartesTuile) => ({
      nom: cartesTuile.nom,
      ...(JSON.parse(cartesTuile.donnees) as DonneesCartesTuiles),
    }));
  }

  // Was `function jsontiles_get($lnk, $key)` in php
  async getTileData(
    nom: DonneesCartesTuilesName,
  ): Promise<DonneesCartesTuilesWithNom | undefined> {
    const cartesTuile = await this.v5Prisma.cartes_tuiles.findUnique({
      where: { nom: nom },
    });
    if (!cartesTuile) {
      return undefined;
    }
    return {
      nom: cartesTuile.nom,
      ...(JSON.parse(cartesTuile.donnees) as DonneesCartesTuiles),
    };
  }
}
