import { Injectable } from '@nestjs/common';

import type { Station, StationGenre, StationPays } from './stations.types';
import { FunctionLogger } from 'src/shared/utils';
import { v5_stations } from 'prisma-v5_data_params/v5-data-params-database-client-types';
import { v5DataParamsPrismaClient } from 'src/database/v5-data-params-prisma-client';

@Injectable()
export class StationsRepository {
  private prisma = v5DataParamsPrismaClient;

  constructor() {}
  private readonly logger = new FunctionLogger(StationsRepository.name);

  private mapping(station: v5_stations): Station {
    if (!station.id) {
      throw new Error('errors.missing_property');
    }
    return {
      id: station.id, // new Encodable(station.id, EncodePrefix.),
      label: station.libelle,
      kind: station.genre as StationGenre,
      country: station.pays as StationPays,
      synopDisabled: station.pas_de_synop === '1',
    };
  }

  async getStationById(stationId: number): Promise<Station> {
    try {
      const station = await this.prisma.v5_stations.findUnique({
        where: { id: stationId },
      });
      if (!station) {
        throw new Error('errors.not_found');
      }
      return this.mapping(station);
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }

  /*
    $lnk = connexionSQL('V5_data_params', false);
    $req = $lnk->query(
        <<<SQL
    SELECT libelle, id, genre, pays
    FROM stations
    WHERE (genre <> 'metar' OR pas_de_synop = '1')
        AND pays IN ('FR', 'BE', 'CH', 'CA', 'DE', 'IT')
    SQL
    );
  */
  async getCommonStations(): Promise<Station[]> {
    try {
      const stations = await this.prisma.v5_stations.findMany({
        where: {
          genre: { not: 'metar' },
          pays: { in: ['FR', 'BE', 'CH', 'CA', 'DE', 'IT'] },
        },
      });
      return stations.map(this.mapping);
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
