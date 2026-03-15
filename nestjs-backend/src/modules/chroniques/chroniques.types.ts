import {
  actualites,
  bulletins_speciaux,
  suivi_special,
} from 'prisma-v5_chroniques/v5-chroniques-database-client-types';
import { replaceAccents } from 'src/shared/utils';
import { getNewsThumbnailImage } from './chroniques.helpers';
import { BulletinTypes, MAPPING_NUM_TO_TYPE } from './chroniques.constants';

const mapType = (type: number): BulletinTypes | 'Unknown' => {
  return MAPPING_NUM_TO_TYPE[type] || 'Unknown';
};

export enum BulletingSpecialType {
  BulletinSpecial = 'sb',
  SuiviSpecial = 'ss',
}

export enum ChroniquesType {
  Bim = 'bim',
  Bqs = 'bqs',
}

// Repo types:

/**
 * Common type for Bqs and Bim news.
 * It's enriched then in the service layer, before exposed to the controller.
 */
export type CommonChroniquesNews = {
  id: number;
  title: string;
  publishedAt: Date | null;
  content: string;
};

export const mappingBqsToChroniqueNews = (
  row: actualites,
): CommonChroniquesNews => {
  return {
    id: row.id,
    title: replaceAccents(row.titre),
    publishedAt: row.bqs_day, // dh - date heure
    content: replaceAccents(row.contenu),
  };
};

export const mappingBimToChroniqueNews = (
  row: actualites,
): CommonChroniquesNews => {
  return {
    id: row.id,
    title: replaceAccents(row.titre),
    publishedAt: row.dh_pub,
    content: replaceAccents(row.contenu),
  };
};

/**
 * Actualites
 */
export type ChroniqueNewsFromActualites = {
  id: number;
  type: ChroniquesType | undefined;
  title: string;
  publishedAt: Date | null;
  content: string;
  thumbnail: string | null;
};

// See `getBimNews` comment,
//  That's why we create a common function:
export const mappingNewsToChroniqueNews = (
  row: actualites,
): ChroniqueNewsFromActualites => {
  return {
    id: row.id,
    type:
      row.type === 'bim'
        ? ChroniquesType.Bim
        : row.type === 'bqs'
          ? ChroniquesType.Bqs
          : undefined,
    title: replaceAccents(row.titre),
    publishedAt: row.dh_pub,
    content: replaceAccents(row.contenu),
    thumbnail: getNewsThumbnailImage({
      contenu: row.contenu,
      thumbHeight: 200,
      thumbWidth: 200,
    }),
  };
};

/**
 * Special Bulletins
 */
export type SpecialBulletins = {
  id: number;
  summaryTitle: string;
  types: BulletinTypes[];
  createdAt: Date | null;
  closedAt: Date | null;
};

export const mappingSpecialBulletins = (
  row: bulletins_speciaux,
): SpecialBulletins => {
  const types = row.types.split(',');
  return {
    id: row.id,
    summaryTitle: row.rewriting,
    types: types
      .map((type) => mapType(+type))
      .filter((type): type is BulletinTypes => type !== 'Unknown'),
    createdAt: row.dh_pub,
    closedAt: row.dh_clot,
  };
};

/**
 * Suivi Special
 */
export type SuiviSpecial = {
  id: number;
  types: BulletinTypes[];
  startedAt: Date | null;
  endedAt: Date | null;
};

export const mappingSuiviSpecial = (row: suivi_special): SuiviSpecial => {
  const types = row.types.split(',');
  return {
    id: row.id,
    types: types
      .map((type) => mapType(+type))
      .filter((type): type is BulletinTypes => type !== 'Unknown'),
    startedAt: row.dh_deb,
    endedAt: row.dh_fin,
  };
};

// Custom types (service layer):

export type Bs2s = {
  link: string;
  dateRange: string;
  types: string[];
};

export type MobileNews = Omit<
  ChroniqueNewsFromActualites,
  'type' | 'publishedAt'
> & {
  type: 'bqs' | 'bim';
  publishedAt: string;
  summary: string;
  url: string;
};
