// Custom types (service layer):

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

export type HomepageMapData = {
  ltiles: Record<
    string,
    {
      info: HomepageTileInfo;
      key?: string | false;
    }
  >;
  lanim: Record<string, HomepageAnimTile[]>;
  isNightTime: boolean;
};
