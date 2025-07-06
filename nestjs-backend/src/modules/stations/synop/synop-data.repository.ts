import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { ConfigService } from 'src/config/config.service';
import { PrismaService } from 'src/database/prisma.service';
import { FunctionLogger } from 'src/shared/utils';
import { SynopPerStationPerYmdh } from './synop-data.types';

@Injectable()
export class SynopDataRepository {
  private readonly logger = new FunctionLogger(SynopDataRepository.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private clientCache: Record<string, PrismaClient> = {};

  /**
   * We got one database per year (ex: V5_data_1900, V5_data_1901, ...)
   *
   * @param year
   * @returns
   */
  private getClientForYear(year: number): PrismaClient {
    // see .env.sample
    const dbUrl =
      `${this.configService.get(`DATABASE_V5_PER_YEAR_URL`)}`.replace(
        'YYYY',
        year.toString(),
      );
    if (!dbUrl) {
      this.logger.error(`No DB URL for year ${year}`);
      throw new Error(`errors.no_db_url_for_year`);
    }
    if (!this.clientCache[year]) {
      this.clientCache[year] = new PrismaClient({
        datasources: { db: { url: dbUrl } },
      });
    }
    // Persist the client for year ${year} in cache:
    return this.clientCache[year];
  }

  private mapping(row: Prisma.synop_MM_dDDCreateInput): SynopPerStationPerYmdh {
    return {
      stationId: row.id_station,
      dhUtc: new Date(row.dh_utc),
      temperature: row.temperature,
      humidite: row.humidite,
      pointDeRosee: row.point_de_rosee,
      pression: row.pression,
      ventDirection: row.vent_direction,
      ventMoyen: row.vent_moyen,
      ventRafales: row.vent_rafales,
      ventRafales10min: row.vent_rafales_10min,
      tempsOmm: row.temps_omm,
    };
  }

  /*
  SELECT *
    FROM synop_{$mois}_d{$numd}
    WHERE id_station = {$l2->quote($rep['id'])}
        AND dh_utc >= DATE_SUB(UTC_TIMESTAMP(), INTERVAL 3 HOUR)
    ORDER BY dh_utc DESC
    LIMIT 1
  */
  async getSynopData({
    stationId,
    yyyy,
    mm,
    dd,
    now,
  }: {
    stationId: number;
    yyyy: number;
    mm: number;
    dd: number;
    now?: string; // datetime  as a `DATE_SUB` argument
  }) {
    try {
      const client = this.getClientForYear(yyyy);
      const row = await client.$queryRaw<Prisma.synop_MM_dDDCreateInput>`
          SELECT * 
            FROM synop_${mm}_d${dd} WHERE id_station = ${stationId}
            AND dh_utc >= DATE_SUB(${Prisma.sql`${now || 'UTC_TIMESTAMP()'}`}, INTERVAL 3 HOUR)
            ORDER BY dh_utc 
            DESC LIMIT 1
        `;
      if (!row) {
        return undefined;
      }
      return this.mapping(row);
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
