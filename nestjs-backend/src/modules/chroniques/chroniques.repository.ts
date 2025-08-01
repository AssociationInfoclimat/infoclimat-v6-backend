import { Injectable } from '@nestjs/common';
import {
  actualites,
  bulletins_speciaux,
  PrismaClient,
  suivi_special,
} from 'prisma-v5_chroniques/v5-chroniques-database-client-types';
import { ConfigService } from 'src/config/config.service';
import { v5ChroniquesPrismaClient } from 'src/database/v5-chroniques-prisma-client';
import { FunctionLogger, replaceAccents } from 'src/shared/utils';
import { MAPPING_NUM_TO_TYPE } from './chroniques.constants';
import { Types } from './chroniques.types';

@Injectable()
export class ChroniquesRepository {
  private prisma = v5ChroniquesPrismaClient;
  private readonly logger = new FunctionLogger(ChroniquesRepository.name);
  constructor(private readonly configService: ConfigService) {}

  private mapType(type: number): Types | 'Unknown' {
    return MAPPING_NUM_TO_TYPE[type] || 'Unknown';
  }

  private mappingBqs(row: actualites) {
    return {
      id: row.id,
      title: replaceAccents(row.titre),
      publishedAt: row.bqs_day, // dh - date heure
      content: replaceAccents(row.contenu),
    };
  }

  async getBqsNews({ limit = 4 }: { limit?: number }) {
    try {
      /*
        SELECT
            id,
            titre,
            bqs_day AS dh,
            contenu AS txt
        FROM V5_chroniques.actualites
            WHERE `type` = 'bqs' 
            AND indice_importance <> -1
            ORDER BY bqs_day DESC
            LIMIT 4
      */
      const getNews = await this.prisma.actualites.findMany({
        where: {
          type: 'bqs',
          indice_importance: { not: -1 },
        },
        orderBy: {
          bqs_day: 'desc',
        },
        take: limit || undefined,
      });
      return getNews.map(this.mappingBqs);
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }

  private mappingBimNews(row: actualites) {
    return {
      id: row.id,
      title: replaceAccents(row.titre),
      publishedAt: row.dh_pub,
      content: replaceAccents(row.contenu),
    };
  }

  async getBimNews({ limit = 5 }: { limit?: number }) {
    try {
      /*
        SELECT
            id,
            dh_pub AS dh,
            contenu AS texte,
            titre 
        FROM V5_chroniques.actualites
        WHERE `type` = 'bim'
            AND indice_importance <> -1
        ORDER BY dh_pub DESC
        LIMIT 5
      */
      const bimNewsRows = await this.prisma.actualites.findMany({
        where: {
          type: 'bim',
          indice_importance: { not: -1 },
        },
        orderBy: {
          dh_pub: 'desc',
        },
        take: limit || undefined,
      });
      return bimNewsRows.map(this.mappingBimNews);
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }

  private mappingSpecialBulletins(row: bulletins_speciaux) {
    const types = row.types.split(',');
    return {
      id: row.id,
      summaryTitle: row.rewriting,
      types: types
        .map((type) => this.mapType(+type))
        .filter((type) => type !== 'Unknown'),
      createdAt: row.dh_pub,
      closedAt: row.dh_clot,
    };
  }

  async getSpecialBulletins({ limit = 3 }: { limit?: number }) {
    try {
      /*
        SELECT id, rewriting, types, dh_pub, dh_clot
        FROM V5_chroniques.bulletins_speciaux
            ORDER BY dh_pub DESC
            LIMIT 3
      */
      const getSpecialBulletins = await this.prisma.bulletins_speciaux.findMany(
        {
          orderBy: {
            dh_pub: 'desc',
          },
          take: limit || undefined,
        },
      );
      return getSpecialBulletins.map((item) =>
        this.mappingSpecialBulletins(item),
      );
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }

  private mappingSuiviSpecial(row: suivi_special) {
    const types = row.types.split(',');
    return {
      id: row.id,
      types: types
        .map((type) => this.mapType(+type))
        .filter((type) => type !== 'Unknown'),
      startedAt: row.dh_deb,
      endedAt: row.dh_fin,
    };
  }

  async getSuiviSpecial({ limit = 3 }: { limit?: number }) {
    /*
        SELECT id, types, dh_deb, dh_fin
        FROM V5_chroniques.suivi_special
        ORDER BY dh_deb DESC
        LIMIT 3
    */
    const getSuiviSpecial = await this.prisma.suivi_special.findMany({
      orderBy: {
        dh_deb: 'desc',
      },
      take: limit || undefined,
    });
    return getSuiviSpecial.map((item) => this.mappingSuiviSpecial(item));
  }
}
