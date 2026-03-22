import { IsBoolean, IsObject } from 'class-validator';
import type {
  HomepageAnimTile,
  HomepageMapData,
} from './homepage-map-data.types';

export class HomepageMapDataDto {
  @IsObject()
  ltiles: Record<
    string,
    {
      info: {
        year: string;
        month: string;
        day: string;
        hour: string;
        minute: string;
      };
      key?: string | false;
    }
  >;

  @IsObject()
  lanim: Record<
    string,
    {
      k: string;
      year: string;
      month: string;
      day: string;
      hour: string;
      minute: string;
    }[]
  >;

  @IsBoolean()
  isNightTime: boolean;

  static toDto(homepageMapData: HomepageMapData): HomepageMapDataDto {
    const ltiles: Record<
      string,
      {
        info: {
          year: string;
          month: string;
          day: string;
          hour: string;
          minute: string;
        };
        key?: string | false;
      }
    > = {};
    for (const [key, value] of Object.entries(homepageMapData.ltiles)) {
      ltiles[key] = {
        info: {
          year: value.info.year.toString(),
          month: value.info.month,
          day: value.info.day,
          hour: value.info.hour,
          minute: value.info.minute,
        },
      };
    }

    const lanim: Record<
      string,
      {
        k: string;
        year: string;
        month: string;
        day: string;
        hour: string;
        minute: string;
      }[]
    > = {};
    for (const [key, value] of Object.entries(homepageMapData.lanim)) {
      lanim[key] = value.map((item: HomepageAnimTile) => ({
        ...item,
        year: item.year.toString(),
      }));
    }

    return {
      ltiles: ltiles,
      lanim: lanim,
      isNightTime: homepageMapData.isNightTime,
    };
  }
}
