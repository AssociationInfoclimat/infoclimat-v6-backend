import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TilesSqliteService } from 'src/modules/feature-modules/tiles-sqlite/tiles-sqlite.service';
import {
  CarteStationQuery,
  CarteStationDataItem,
  CarteStationResponse,
  LegacyStationData,
  CarteStationParam,
} from './carte-station.types';
import { TilesDonneeRow } from 'src/modules/feature-modules/tiles-sqlite/tiles-sqlite.types';

const SPECIAL_MONTHS = new Set(['all', 'automne', 'printemps', 'ete', 'hiver']);

const PARAMS_ALLOWING_EMPTY_VALUE = new Set<CarteStationParam>([
  'temps_omm',
  'ec_tmm',
  'ec_tnm',
  'ec_txm',
]);

const Z_TO_PRECISION: Record<number, number> = {
  1: 1 / 10,
  2: 1 / 8,
  3: 1 / 3.5,
  4: 1 / 2,
  5: 1,
  6: 2,
  7: 3,
  8: 8,
  9: 500,
  10: 500,
};

/**
 * OMM weather code → MA picto name mapping.
 * Used by getModernWeather to resolve icon URLs.
 */
const OMM_TO_MA: Record<string, string> = {
  '10': 'brouillard',
  '11': 'brouillard',
  '12': 'brouillard',
  '13': 'orage_faible',
  '17': 'orage_faible',
  '18': 'ligne_grains',
  '19': 'tuba',
  '20': 'averse_faible',
  '21': 'averse_faible',
  '22': 'neige_faible',
  '23': 'neige_fond',
  '24': 'verglas',
  '25': 'averses',
  '26': 'bneige',
  '27': 'grele',
  '28': 'brouillard',
  '29': 'orage_faible',
  '36': 'bsnow',
  '37': 'bsnow',
  '38': 'bsnow',
  '39': 'bsnow',
  '40': 'brouillard',
  '41': 'brouillard',
  '42': 'brouillard',
  '43': 'brouillard',
  '44': 'brouillard',
  '45': 'brouillard',
  '46': 'brouillard',
  '47': 'brouillard',
  '48': 'brouillardg',
  '49': 'brouillardg',
  '50': 'averse_faible',
  '51': 'averse_faible',
  '52': 'averse_faible',
  '53': 'averse_faible',
  '54': 'bruine_forte',
  '55': 'bruine_forte',
  '56': 'verglas',
  '57': 'verglas',
  '58': 'averse_faible',
  '59': 'pluie_moderee',
  '60': 'averse_faible',
  '61': 'averse_faible',
  '62': 'pluie_moderee',
  '63': 'pluie_moderee',
  '64': 'pluie_forte',
  '65': 'pluie_forte',
  '66': 'verglas',
  '67': 'verglas',
  '68': 'neige_faible',
  '69': 'neige_moderee',
  '70': 'neige_faible',
  '71': 'neige_faible',
  '72': 'neige_moderee',
  '73': 'neige_moderee',
  '74': 'neige_forte',
  '75': 'neige_forte',
  '80': 'averse_faible',
  '82': 'averses',
  '83': 'averses',
  '84': 'averses',
  '85': 'bneige',
  '86': 'bneige',
  '87': 'bneige',
  '88': 'bneige',
  '89': 'grele',
  '90': 'grele',
  '91': 'cumulo',
  '92': 'cumulo',
  '93': 'neige_faible',
  '94': 'neige_moderee',
  '95': 'orage_faible',
  '96': 'orage_faible',
  '97': 'orage_fort',
  '98': 'orage_faible',
  '99': 'orage_fort',
};

type IconResult = {
  icon: string;
  size: [number, number];
  anchor: [number, number];
};

@Injectable()
export class CarteStationService {
  constructor(private readonly tilesSqliteService: TilesSqliteService) {}

  getCarteStation(query: CarteStationQuery): CarteStationResponse {
    const start = performance.now();

    const month = SPECIAL_MONTHS.has(query.month)
      ? query.month
      : String(parseInt(query.month, 10));

    const rows = this.fetchRows(query, month);
    const pr = this.getPrecision(query.z, query.density);
    const round = this.getRoundPrecision(query.param, query.z);
    const noClustering = this.resolveNoClustering(query);

    const found: Record<string, number> = {};
    const data: CarteStationDataItem[] = [];

    for (const row of rows) {
      const d = this.parseRowData(row.data);
      if (!d) {
        continue;
      }

      const value = d[query.param];
      if (!PARAMS_ALLOWING_EMPTY_VALUE.has(query.param)) {
        if (value === '' || value == null) {
          continue;
        }
      }

      if (query.officialOnly && d.genre === 'static') {
        continue;
      }

      if (this.isMfStationFiltered(d, query.year)) {
        continue;
      }

      const newLat = Math.round(row.latitude * pr) / pr;
      const newLon = Math.round(row.longitude * pr) / pr;
      const key = `${newLat}-${newLon}`;

      if (!noClustering && key in found) {
        continue;
      }

      const iconInfo = this.buildIcon(
        query.param,
        value,
        d,
        query.retina,
        round,
      );
      if (!iconInfo) {
        continue;
      }

      const numericValue =
        typeof value === 'number' ? value : parseFloat(String(value));

      data.push({
        id: row.rowid,
        lat: row.latitude,
        lon: row.longitude,
        t: Number.isFinite(numericValue) ? numericValue : 0,
        icon: iconInfo.icon,
        size: iconInfo.size,
        anchor: iconInfo.anchor,
        _uid: d.id_station ?? '',
        auid: (d.genre === 'bouees' ? 'buoy:' : '') + (d.id_station ?? ''),
        _ty: d.genre ?? '',
        meta: query.returnMeta ? this.stripInternalFields(d) : false,
      });

      found[key] = data.length - 1;
    }

    const elapsed = (performance.now() - start) / 1000;

    return {
      elapsed: elapsed,
      data: data,
    };
  }

  private fetchRows(query: CarteStationQuery, month: string): TilesDonneeRow[] {
    const dbParams = {
      year: query.year,
      month,
      day: query.day,
      hour: query.hour,
      param: query.param,
    };

    try {
      if (query.z === 99) {
        return this.tilesSqliteService.queryDonnees(dbParams);
      }
      return this.tilesSqliteService.queryDonnees(dbParams, {
        minLat: query.south,
        maxLat: query.north,
        minLon: query.west,
        maxLon: query.east,
      });
    } catch {
      throw new HttpException(
        {
          API: {
            status: 'ERROR',
            errorcode: '5001',
            errormsg: 'Proxy Error (cache file not found)',
            time: 0,
          },
          DATA: [],
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private getPrecision(z: number, density: number): number {
    let pr: number;
    if (z > 10) {
      pr = 500;
    } else {
      pr = Z_TO_PRECISION[z] ?? 1;
    }
    if (density > 0) {
      pr *= density;
    }
    return pr;
  }

  private getRoundPrecision(
    param: CarteStationQuery['param'],
    z: number,
  ): number {
    if (param === 'temperature_min' || param === 'temperature_max') {
      return 1;
    }
    if (param.toLowerCase().includes('climm')) {
      return 1;
    }
    if (z <= 6) {
      return 0;
    }
    return 1;
  }

  private resolveNoClustering(query: CarteStationQuery): boolean {
    let noClustering = query.noClustering > 0;
    const spanLat = query.north - query.south;
    const spanLon = query.east - query.west;
    if ((spanLat > 30 || spanLon > 30) && query.noClustering !== 2) {
      noClustering = false;
    }
    return noClustering;
  }

  private parseRowData(raw: string): LegacyStationData | null {
    try {
      const d = JSON.parse(raw) as LegacyStationData;
      delete d.raw_msg;
      delete d.source;
      delete d.latitude;
      delete d.longitude;
      delete d.dh_utc;
      return d;
    } catch {
      return null;
    }
  }

  private isMfStationFiltered(d: LegacyStationData, year: number): boolean {
    if (year === 8110) {
      return false;
    }

    const id = d.id_station ?? '';
    if (id.substring(0, 2) === 'MF') {
      return true;
    }
    if (d.genre === 'mf' && id.length === 8) {
      return true;
    }
    if ((d.libelle ?? '').includes('RADOME')) {
      return true;
    }

    return false;
  }

  private buildIcon(
    param: string,
    value: unknown,
    data: LegacyStationData,
    retina: boolean,
    round: number,
  ): IconResult | null {
    if (param === 'nebulosite') {
      return this.buildNebulositIcon(value);
    }
    if (param === 'temps_omm') {
      return this.buildTempsOmmIcon(value, data.nebulosite, retina);
    }
    if (param === 'vent_moyen') {
      return this.buildVentMoyenIcon(value, data.vent_direction);
    }
    return this.buildDefaultIcon(param, value, round, retina);
  }

  private buildNebulositIcon(value: unknown): IconResult | null {
    const v = Number(value);
    if (v < 0 || v > 9 || !Number.isFinite(v)) {
      return null;
    }
    return {
      icon: `https://static.infoclimat.net/images/nebulosite/${v}.png`,
      size: [24, 24],
      anchor: [12, 12],
    };
  }

  /**
   * Port of the PHP getModernWeather() function from stations.inc.php
   */
  private buildTempsOmmIcon(
    code: unknown,
    nebulosite: number | null | undefined,
    retina: boolean,
  ): IconResult | null {
    const w = retina ? 64 : 30;
    const h = retina ? 64 : 30;
    const codeStr = String(code);

    const maName = OMM_TO_MA[codeStr];
    if (maName) {
      return {
        icon: `https://static.infoclimat.net/images/pictos/${w}_${h}_clr/${maName}.png`,
        size: [w, h],
        anchor: [Math.floor(w / 2), Math.floor(h / 2)],
      };
    }

    const codeNum = Number(code);
    if (codeNum > 4 && codeNum <= 99) {
      return {
        icon: `https://static.infoclimat.net/images/temps_present/${codeNum}.gif`,
        size: [28, 17],
        anchor: [14, 8],
      };
    }

    if (nebulosite != null && nebulosite >= 0 && nebulosite <= 8) {
      let nebv: string;
      if (nebulosite === 0) {
        nebv = 'soleil';
      } else if (nebulosite <= 2) {
        nebv = 'nuageux';
      } else if (nebulosite <= 4) {
        nebv = 'eclaircies';
      } else if (nebulosite <= 6) {
        nebv = 'nuage2';
      } else {
        nebv = 'nuage3';
      }
      return {
        icon: `https://static.infoclimat.net/images/pictos/${w}_${h}_clr/${nebv}.png`,
        size: [w, h],
        anchor: [Math.floor(w / 2), Math.floor(h / 2)],
      };
    }

    return null;
  }

  private buildVentMoyenIcon(
    value: unknown,
    direction: number | null | undefined,
  ): IconResult | null {
    const v = Number(value);
    if (!Number.isFinite(v)) {
      return null;
    }
    const knots = Math.round((v * 0.5399569444) / 5) * 5;
    const dir = Math.round(Number(direction ?? 0) / 5) * 5;
    return {
      icon: `https://www.infoclimat.fr/cartes/valeurs/vent_moyen/d/${knots}_${dir}.png`,
      size: [40, 40],
      anchor: [20, 20],
    };
  }

  private buildDefaultIcon(
    param: string,
    value: unknown,
    round: number,
    retina: boolean,
  ): IconResult | null {
    const numValue = Number(value);
    if (!Number.isFinite(numValue)) {
      return null;
    }

    let paramPNG = param;
    if (param === 'temperature_max_24h') {
      paramPNG = 'temperature_max';
    } else if (param === 'temperature_min_24h') {
      paramPNG = 'temperature_min';
    }

    const roundedValue = this.roundTo(numValue, round);
    const folder = retina ? '2x' : 'd';
    return {
      icon: `https://www.infoclimat.fr/cartes/valeurs/${paramPNG}/${folder}/${roundedValue}_${round}.png`,
      size: [32, 18],
      anchor: [16, 18],
    };
  }

  private roundTo(value: number, decimals: number): number {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }

  private stripInternalFields(d: LegacyStationData): Record<string, unknown> {
    const copy = { ...d };
    delete copy.raw_msg;
    delete copy.source;
    delete copy.latitude;
    delete copy.longitude;
    delete copy.dh_utc;
    return copy;
  }
}
