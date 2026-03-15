import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { v5ChroniquesPrismaClient } from 'src/database/v5-chroniques-prisma-client';
import { FunctionLogger } from 'src/shared/utils';
import {
  ChroniqueNewsFromActualites,
  CommonChroniquesNews,
  mappingBimToChroniqueNews,
  mappingBqsToChroniqueNews,
  mappingNewsToChroniqueNews,
  mappingSpecialBulletins,
  mappingSuiviSpecial,
  SpecialBulletins,
  SuiviSpecial,
} from './chroniques.types';

@Injectable()
export class ChroniquesRepository {
  private prisma = v5ChroniquesPrismaClient;
  private readonly logger = new FunctionLogger(ChroniquesRepository.name);
  constructor(private readonly configService: ConfigService) {}

  async getBqsNews({
    limit = 4,
  }: {
    limit?: number;
  }): Promise<CommonChroniquesNews[]> {
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
    return getNews.map(mappingBqsToChroniqueNews);
  }

  // TODO: could be merged with `getBqsNews`, but mapping is different
  async getBimNews({
    limit = 5,
  }: {
    limit?: number;
  }): Promise<CommonChroniquesNews[]> {
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
    return bimNewsRows.map(mappingBimToChroniqueNews);
  }

  // Merged function to get `actualites`
  // TODO: Could replace both `getBimNews` and `getBqsNews`
  // For now, only used for a mobile endpoint:
  async getNews({
    limit = 5,
    type,
    onlyImportant,
  }: {
    limit?: number;
    type?: 'bim' | 'bqs';
    onlyImportant?: boolean;
  }): Promise<ChroniqueNewsFromActualites[]> {
    const newsRows = await this.prisma.actualites.findMany({
      where: {
        type,
        indice_importance: onlyImportant ? { not: -1 } : undefined,
      },
      orderBy: {
        dh_pub: 'desc',
      },
      take: limit || undefined,
    });
    return newsRows.map(mappingNewsToChroniqueNews);
  }

  async getSpecialBulletins({
    limit = 3,
  }: {
    limit?: number;
  }): Promise<SpecialBulletins[]> {
    /*
        SELECT id, rewriting, types, dh_pub, dh_clot
        FROM V5_chroniques.bulletins_speciaux
            ORDER BY dh_pub DESC
            LIMIT 3
      */
    const getSpecialBulletins = await this.prisma.bulletins_speciaux.findMany({
      orderBy: {
        dh_pub: 'desc',
      },
      take: limit || undefined,
    });
    return getSpecialBulletins.map((item) => mappingSpecialBulletins(item));
  }

  async getSuiviSpecial({
    limit = 3,
  }: {
    limit?: number;
  }): Promise<SuiviSpecial[]> {
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
    return getSuiviSpecial.map((item) => mappingSuiviSpecial(item));
  }
}
