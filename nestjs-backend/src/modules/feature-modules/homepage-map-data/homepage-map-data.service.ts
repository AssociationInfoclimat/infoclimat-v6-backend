import { Injectable } from '@nestjs/common';
import { StationsMeteoService } from 'src/modules/entity-modules/stations-meteo/stations-meteo.service';
import { md5key } from 'src/modules/entity-modules/stations-meteo/stations-meteo.utils';
import {
  HomepageMapData,
  HomepageMapDataWithAdditionalKeys,
  HomepageTileInfo,
} from './homepage-map-data.types';

const ALLOWED_PARAMS = new Set<string>([
  'colorac60radaric',
  'ac3hradaric',
  'ac6hradaric',
  'ac12hradaric',
  'ac24hradaric',
  'ac72hradaric',
  'radaric',
  'temperature',
  'pression',
  'clouds',
  'foudre',
  'MCanalysis',
  'point_de_rosee',
  'temperature_eau',
  'temps_omm',
  'estofex',
  'nexrad',
  'goeswi4',
  'goeswv1',
  'goesei4',
  'goesev1',
  'goeswv2',
  'goesergb',
  'goesei7',
  'himawarirgb',
  'vishdbtrans',
  'irAhdbtrans',
]);

const pad2 = (value: number): string => `${value}`.padStart(2, '0');

const getTileInfo = (date: Date): HomepageTileInfo => ({
  year: date.getFullYear(),
  month: pad2(date.getMonth() + 1),
  day: pad2(date.getDate()),
  hour: pad2(date.getHours()),
  minute: pad2(date.getMinutes()),
});

const getUtcTileInfo = (date: Date): HomepageTileInfo => ({
  year: date.getUTCFullYear(),
  month: pad2(date.getUTCMonth() + 1),
  day: pad2(date.getUTCDate()),
  hour: pad2(date.getUTCHours()),
  minute: pad2(date.getUTCMinutes()),
});

const getUtcTileInfoFromMs = (timestampMs: number): HomepageTileInfo =>
  getUtcTileInfo(new Date(timestampMs));

@Injectable()
export class HomepageMapDataService {
  constructor(private readonly stationsMeteoService: StationsMeteoService) {}

  async getAndPersistHomepageMapData(): Promise<HomepageMapDataWithAdditionalKeys> {
    //
    // Fetch the data from the db and enrich it with the additional keys:
    const lastDataPrd = await this._getHomepageMapData();

    // Was persisted in `$_memcached->get('in****hp:l****sqlite')` in legacy
    await this._persistHomepageMapData(lastDataPrd);

    return lastDataPrd;
  }

  /**
   * Fetch the data from the db and build the unique keys of the tiles,
   *  that will match to real files in production that contains the jpg tiles.
   *
   * For some tiles, the keys already are in `getTilesData` method, but for other ones
   *  we need to build the key manually.
   */
  private async _getHomepageMapData(): Promise<HomepageMapDataWithAdditionalKeys> {
    const tilesData = await this.stationsMeteoService.getTilesData();

    const lastDataPrd: Omit<HomepageMapDataWithAdditionalKeys, 'ltiles'> & {
      ltiles: Partial<HomepageMapDataWithAdditionalKeys['ltiles']>;
    } = {
      ltiles: {} as Partial<HomepageMapDataWithAdditionalKeys['ltiles']>,
      lanim: {},
      isNightTime: false,
    };

    for (const tile of tilesData) {
      const tileName = tile.nom;
      if (!tileName || !ALLOWED_PARAMS.has(tileName)) {
        continue;
      }

      const year = Number.parseInt(tile.year, 10);
      const month = Number.parseInt(tile.month, 10);
      const day = Number.parseInt(tile.day, 10);
      const hour = Number.parseInt(tile.hour, 10);
      const minute = Number.parseInt(tile.minute, 10);

      if (
        [year, month, day, hour, minute].some((v) => Number.isNaN(v)) ||
        month < 1 ||
        day < 1
      ) {
        continue;
      }

      const currentDate = new Date(year, month - 1, day, hour, minute, 0);
      const currentInfo = getTileInfo(currentDate);

      lastDataPrd.ltiles[tileName] = {
        key:
          tile.key ||
          md5key({
            param: tileName,
            data: {
              year: currentInfo.year,
              month,
              day,
              hour,
            },
          }),
        info: currentInfo,
      };

      let interv = 1;
      let nhours = 6;
      let originalHour = false;

      if (tileName === 'radarmf') {
        interv = 0.25;
        nhours = 2;
        originalHour = true;
      } else if (tileName === 'radaric') {
        interv = 1 / 12;
        nhours = 0.5;
        originalHour = true;
      } else if (tileName === 'clouds' || tileName === 'foudre') {
        interv = 0.5;
        nhours = 4;
        originalHour = true;
      }

      lastDataPrd.lanim[tileName] = [];
      for (let i = nhours; i >= 0; i -= interv) {
        const frameDate = new Date(currentDate.getTime() - 3600 * 1000 * i);
        const frameInfo = getTileInfo(frameDate);
        const frameHourAsNumber = Number.parseInt(frameInfo.hour, 10);

        const minuteForFrame =
          Math.abs(i) < 1e-9
            ? currentInfo.minute
            : originalHour
              ? frameInfo.minute
              : frameHourAsNumber % 3 === 0
                ? '59'
                : '45';

        lastDataPrd.lanim[tileName].push({
          k: md5key({
            param: tileName,
            data: {
              year: frameInfo.year,
              month: Number.parseInt(frameInfo.month, 10),
              day: Number.parseInt(frameInfo.day, 10),
              hour: Number.parseInt(frameInfo.hour, 10),
            },
          }),
          year: frameInfo.year,
          month: frameInfo.month,
          day: frameInfo.day,
          hour: frameInfo.hour,
          minute: minuteForFrame,
        });
      }
    }

    const utcNow = new Date();
    const utcNowInfo = getUtcTileInfo(utcNow);

    lastDataPrd.ltiles.meteoalerte = { info: utcNowInfo };
    lastDataPrd.ltiles.webcams = { info: utcNowInfo };
    lastDataPrd.ltiles.vigilance = {
      info: utcNowInfo,
      key: md5key({
        param: 'vigilance',
        data: {
          year: utcNowInfo.year,
          month: Number.parseInt(utcNowInfo.month, 10),
          day: Number.parseInt(utcNowInfo.day, 10),
          hour: Number.parseInt(utcNowInfo.hour, 10),
        },
      }),
    };

    await this._addMetOfficeTiles(lastDataPrd);

    lastDataPrd.ltiles.modis = {
      info: {
        year: 2015,
        month: '04',
        day: '15',
        hour: '00',
        minute: '00',
      },
      key: false,
    };

    const nowHour = new Date().getHours();
    lastDataPrd.isNightTime = nowHour >= 19 || nowHour <= 6;
    //
    // From here, `lastDataPrd.ltiles` is fully populated,
    //  not a Partial<> anymore,
    //  we can build the final object:
    //
    const finalData: HomepageMapDataWithAdditionalKeys = {
      ...lastDataPrd,
      ltiles: lastDataPrd.ltiles as HomepageMapDataWithAdditionalKeys['ltiles'],
    };

    return finalData;
  }

  private async _addMetOfficeTiles(
    lastDataPrd: Omit<HomepageMapDataWithAdditionalKeys, 'ltiles'> & {
      ltiles: Partial<HomepageMapDataWithAdditionalKeys['ltiles']>;
    },
  ): Promise<void> {
    const observationUrl =
      'http://www.metoffice.gov.uk/public/data/LayerCache/GetCapabilities/Item/Observation';
    const forecastUrl =
      'http://www.metoffice.gov.uk/public/data/LayerCache/GetCapabilities/Item/Forecast';

    try {
      const [observationResponse, forecastResponse] = await Promise.all([
        fetch(observationUrl),
        fetch(forecastUrl),
      ]);

      const [observationXml, forecastXml] = await Promise.all([
        observationResponse.text(),
        forecastResponse.text(),
      ]);

      const satelliteVisTime = this._extractLayerFirstTime(
        observationXml,
        'SatelliteVis',
      );
      const satelliteIrTime = this._extractLayerFirstTime(
        observationXml,
        'SatelliteIR',
      );

      if (satelliteVisTime) {
        const satHours = 1;
        const satInterval = 0.25;

        lastDataPrd.ltiles.vis = {
          info: getUtcTileInfoFromMs(satelliteVisTime),
          key: md5key({
            param: 'vis',
            data: {
              year: new Date(satelliteVisTime).getUTCFullYear(),
              month: new Date(satelliteVisTime).getUTCMonth() + 1,
              day: new Date(satelliteVisTime).getUTCDate(),
              hour: new Date(satelliteVisTime).getUTCHours(),
            },
          }),
        };

        lastDataPrd.lanim.vis = [];
        for (let i = satHours; i >= 0; i -= satInterval) {
          const frameMs = satelliteVisTime - i * 3600 * 1000;
          const frameInfo = getUtcTileInfoFromMs(frameMs);
          lastDataPrd.lanim.vis.push({
            k: md5key({
              param: 'vis',
              data: {
                year: frameInfo.year,
                month: Number.parseInt(frameInfo.month, 10),
                day: Number.parseInt(frameInfo.day, 10),
                hour: Number.parseInt(frameInfo.hour, 10),
              },
            }),
            ...frameInfo,
          });
        }
      }

      if (satelliteIrTime) {
        const satHours = 1;
        const satInterval = 0.25;

        lastDataPrd.ltiles.irA = {
          info: getUtcTileInfoFromMs(satelliteIrTime),
          key: md5key({
            param: 'irA',
            data: {
              year: new Date(satelliteIrTime).getUTCFullYear(),
              month: new Date(satelliteIrTime).getUTCMonth() + 1,
              day: new Date(satelliteIrTime).getUTCDate(),
              hour: new Date(satelliteIrTime).getUTCHours(),
            },
          }),
        };

        lastDataPrd.lanim.irA = [];
        for (let i = satHours; i >= 0; i -= satInterval) {
          const frameMs = satelliteIrTime - i * 3600 * 1000;
          const frameInfo = getUtcTileInfoFromMs(frameMs);
          lastDataPrd.lanim.irA.push({
            k: md5key({
              param: 'irA',
              data: {
                year: frameInfo.year,
                month: Number.parseInt(frameInfo.month, 10),
                day: Number.parseInt(frameInfo.day, 10),
                hour: Number.parseInt(frameInfo.hour, 10),
              },
            }),
            ...frameInfo,
          });
        }
      }

      const pressureData = this._extractPressureData(forecastXml);
      if (pressureData) {
        const nowSec = Date.now() / 1000;
        const closestTimeStep = pressureData.timeSteps.reduce<number>(
          (closest, candidate) => {
            const closestDiff = Math.abs(
              nowSec - (pressureData.defaultTimeSec + closest * 3600),
            );
            const candidateDiff = Math.abs(
              nowSec - (pressureData.defaultTimeSec + candidate * 3600),
            );
            return candidateDiff < closestDiff ? candidate : closest;
          },
          pressureData.timeSteps[0],
        );

        const pressureDefaultMs = pressureData.defaultTimeSec * 1000;
        const pressureInfo = getUtcTileInfoFromMs(pressureDefaultMs);
        lastDataPrd.ltiles.frT = {
          info: {
            ...pressureInfo,
            minute: `${closestTimeStep}`,
          },
          key: md5key({
            param: 'frT',
            data: {
              year: pressureInfo.year,
              month: Number.parseInt(pressureInfo.month, 10),
              day: Number.parseInt(pressureInfo.day, 10),
              hour: Number.parseInt(pressureInfo.hour, 10),
            },
          }),
        };
      }
    } catch {
      // Best-effort: failure to fetch MetOffice data must not fail homepage data generation.
    }
  }

  private _extractLayerFirstTime(
    xml: string,
    displayName: string,
  ): number | undefined {
    const layerRegex = new RegExp(
      `<Layer[^>]*displayName="${displayName}"[^>]*>[\\s\\S]*?<Time>([^<]+)</Time>`,
      'i',
    );
    const match = xml.match(layerRegex);
    if (!match?.[1]) {
      return undefined;
    }

    const timestamp = Date.parse(`${match[1]}Z`);
    return Number.isNaN(timestamp) ? undefined : timestamp;
  }

  private _extractPressureData(
    xml: string,
  ): { defaultTimeSec: number; timeSteps: number[] } | undefined {
    const pressureLayerRegex = new RegExp(
      `<Layer[^>]*displayName="Pressure"[^>]*>[\\s\\S]*?<Timesteps[^>]*defaultTime="([^"]+)"[^>]*>([\\s\\S]*?)</Timesteps>`,
      'i',
    );
    const pressureMatch = xml.match(pressureLayerRegex);
    if (!pressureMatch?.[1] || !pressureMatch[2]) {
      return undefined;
    }

    const defaultTimeSec = Math.floor(
      Date.parse(`${pressureMatch[1]}Z`) / 1000,
    );
    if (Number.isNaN(defaultTimeSec)) {
      return undefined;
    }

    const timeSteps = [
      ...pressureMatch[2].matchAll(/<Timestep>(-?\d+)<\/Timestep>/g),
    ]
      .map((match) => Number.parseInt(match[1], 10))
      .filter((value) => !Number.isNaN(value));

    if (!timeSteps.length) {
      return undefined;
    }

    return { defaultTimeSec, timeSteps };
  }

  private async _persistHomepageMapData(
    _lastDataPrd: HomepageMapData,
  ): Promise<void> {
    // TODO: Implement persistence
  }
}

// Based on this PHP code:
//
// use const Infoclimat\Env\TILES_PATH;
//
// $lnk = connexionSQL('V5');
// $last_data_prd = jsontiles_get_all($lnk);
//
// $last_data_prd2= array();
// ....
