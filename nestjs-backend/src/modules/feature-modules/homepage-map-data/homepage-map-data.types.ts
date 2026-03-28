// Custom types (service layer):

import type { DonneesCartesTuilesName } from 'src/modules/entity-modules/stations-meteo/stations-meteo.types';

export type HomepageTileInfo = {
  year: number;
  month: string;
  day: string;
  hour: string;
  minute: string;
};

export type HomepageAnimTile = HomepageTileInfo & {
  k: string;
};

export type HomepageTileConfig = {
  info: HomepageTileInfo;
  key?: string | false;
};

export type HomepageMapData = {
  ltiles: Record<DonneesCartesTuilesName, HomepageTileConfig>;
  lanim: Record<string, HomepageAnimTile[]>;
  isNightTime: boolean;
};

export type HomepageMapDataWithAdditionalKeys = HomepageMapData & {
  ltiles: Record<DonneesCartesTuilesName, HomepageTileConfig> & {
    meteoalerte: HomepageTileConfig;
    webcams: HomepageTileConfig;
    vigilance: HomepageTileConfig;
    vis: HomepageTileConfig;
    irA: HomepageTileConfig;
    frT: HomepageTileConfig;
    modis: HomepageTileConfig;
  };
};
