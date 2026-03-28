import { IsBoolean, IsObject } from 'class-validator';
import type {
  HomepageAnimTile,
  HomepageMapDataWithAdditionalKeys,
  HomepageTileConfig,
  HomepageTileInfo,
} from './homepage-map-data.types';

type HomepageTileConfigDto = {
  info: {
    year: string;
    month: HomepageTileInfo['month'];
    day: HomepageTileInfo['day'];
    hour: HomepageTileInfo['hour'];
    minute: HomepageTileInfo['minute'];
  };
  key?: string | false;
};

type HomepageTilesConfigsDto = {
  ac12hradaric: HomepageTileConfigDto;
  ac24hradaric: HomepageTileConfigDto;
  ac3hradaric: HomepageTileConfigDto;
  ac6hradaric: HomepageTileConfigDto;
  ac72hradaric: HomepageTileConfigDto;
  clouds: HomepageTileConfigDto;
  colorac60radaric: HomepageTileConfigDto;
  estofex: HomepageTileConfigDto;
  foudre: HomepageTileConfigDto;
  goesei4: HomepageTileConfigDto;
  goesei7: HomepageTileConfigDto;
  goesergb: HomepageTileConfigDto;
  goesev1: HomepageTileConfigDto;
  goeswv2: HomepageTileConfigDto;
  himawarirgb: HomepageTileConfigDto;

  nexrad: HomepageTileConfigDto;
  point_de_rosee: HomepageTileConfigDto;
  pression: HomepageTileConfigDto;
  radaric: HomepageTileConfigDto;
  temperature: HomepageTileConfigDto;
  temps_omm: HomepageTileConfigDto;
  vishdbtrans: HomepageTileConfigDto;

  //
  // For some reason, we may want to change the case of some keys, that's why we have a DTO for controller output,
  //  and for each we specify the case we want to use:
  //
  m_canalysis: HomepageTileConfigDto;
  ir_ahdbtrans: HomepageTileConfigDto;

  temperature_eau: HomepageTileConfigDto;
  goeswi4: HomepageTileConfigDto;
  goeswv1: HomepageTileConfigDto;

  //
  // Some keys are NOT in the database, but we need to add them here:
  //  and are built in service layer:
  meteoalerte: HomepageTileConfigDto;
  webcams: HomepageTileConfigDto;
  vigilance: HomepageTileConfigDto;
  vis: HomepageTileConfigDto;
  ir_a: HomepageTileConfigDto;
  fr_t: HomepageTileConfigDto;
  modis: HomepageTileConfigDto;
};

export class HomepageMapDataDto {
  @IsObject()
  ltiles: HomepageTilesConfigsDto;

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

  /**
   *
   * This mapper DTO is voluntary complex to avoid any unexpected behavior.
   *
   * Here we map the backend data to the DTO data, and we convert the year to string,
   *  and for some keys we convert to their equivalent in snake case.
   *
   * @returns
   */
  static toDto(
    homepageMapData: HomepageMapDataWithAdditionalKeys,
  ): HomepageMapDataDto {
    //
    // Fill `ltiles` with the data from `homepageMapData.ltiles`
    //  and just convert to `DTO` (output for controller, with snake case some keys)
    const converValueWithYearAsString = <
      T extends HomepageTileConfig | undefined,
    >(
      value: T,
    ): T extends HomepageTileConfig ? HomepageTileConfigDto : undefined =>
      (value !== undefined
        ? {
            info: {
              ...value.info,
              year: value.info.year.toString(),
            },
          }
        : undefined) as T extends HomepageTileConfig
        ? HomepageTileConfigDto
        : undefined;

    const ltiles: HomepageTilesConfigsDto = {
      ac12hradaric: converValueWithYearAsString(
        homepageMapData.ltiles.ac12hradaric,
      ),
      ac24hradaric: converValueWithYearAsString(
        homepageMapData.ltiles.ac24hradaric,
      ),
      ac3hradaric: converValueWithYearAsString(
        homepageMapData.ltiles.ac3hradaric,
      ),
      ac6hradaric: converValueWithYearAsString(
        homepageMapData.ltiles.ac6hradaric,
      ),
      ac72hradaric: converValueWithYearAsString(
        homepageMapData.ltiles.ac72hradaric,
      ),
      clouds: converValueWithYearAsString(homepageMapData.ltiles.clouds),
      colorac60radaric: converValueWithYearAsString(
        homepageMapData.ltiles.colorac60radaric,
      ),
      estofex: converValueWithYearAsString(homepageMapData.ltiles.estofex),
      foudre: converValueWithYearAsString(homepageMapData.ltiles.foudre),
      goesei4: converValueWithYearAsString(homepageMapData.ltiles.goesei4),
      goesei7: converValueWithYearAsString(homepageMapData.ltiles.goesei7),
      goesergb: converValueWithYearAsString(homepageMapData.ltiles.goesergb),
      goesev1: converValueWithYearAsString(homepageMapData.ltiles.goesev1),
      goeswv2: converValueWithYearAsString(homepageMapData.ltiles.goeswv2),
      himawarirgb: converValueWithYearAsString(
        homepageMapData.ltiles.himawarirgb,
      ),
      nexrad: converValueWithYearAsString(homepageMapData.ltiles.nexrad),
      point_de_rosee: converValueWithYearAsString(
        homepageMapData.ltiles.point_de_rosee,
      ),
      pression: converValueWithYearAsString(homepageMapData.ltiles.pression),
      radaric: converValueWithYearAsString(homepageMapData.ltiles.radaric),
      temperature: converValueWithYearAsString(
        homepageMapData.ltiles.temperature,
      ),
      temps_omm: converValueWithYearAsString(homepageMapData.ltiles.temps_omm),
      vishdbtrans: converValueWithYearAsString(
        homepageMapData.ltiles.vishdbtrans,
      ),
      temperature_eau: converValueWithYearAsString(
        homepageMapData.ltiles.temperature_eau,
      ),
      goeswi4: converValueWithYearAsString(homepageMapData.ltiles.goeswi4),
      goeswv1: converValueWithYearAsString(homepageMapData.ltiles.goeswv1),

      //
      // These keys are filled with the custom keys built in service layer
      //  (not directly in the database): webcams, meteoalerte, vigilance, vis, ir_a, fr_t, modis...
      meteoalerte: converValueWithYearAsString(
        homepageMapData.ltiles.meteoalerte,
      ),
      webcams: converValueWithYearAsString(homepageMapData.ltiles.webcams),
      vigilance: converValueWithYearAsString(homepageMapData.ltiles.vigilance),
      vis: converValueWithYearAsString(homepageMapData.ltiles.vis),
      ir_a: converValueWithYearAsString(homepageMapData.ltiles.irA),
      fr_t: converValueWithYearAsString(homepageMapData.ltiles.frT),
      modis: converValueWithYearAsString(homepageMapData.ltiles.modis),

      //
      // Some keys are converted to their equivalent in snake case:
      ir_ahdbtrans: converValueWithYearAsString(
        homepageMapData.ltiles.irAhdbtrans,
      ),
      m_canalysis: converValueWithYearAsString(
        homepageMapData.ltiles.MCanalysis,
      ),
    };

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
