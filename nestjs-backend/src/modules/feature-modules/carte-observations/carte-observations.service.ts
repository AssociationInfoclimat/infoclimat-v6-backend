import { Injectable } from '@nestjs/common';
import { CarteMaCacheService } from 'src/modules/entity-modules/carte-ma-cache/carte-ma-cache.service';
import {
  CarteObservationItem,
  CarteObservationsQuery,
  CarteObservationsResponse,
} from './carte-observations.types';

type LegacyDataPayload = {
  type?: string;
  phenos?: string[];
  values?: Array<number | string | null>;
  pheno?: string;
  meta?: {
    allmeta?: {
      stid?: string | number;
      vent_direction?: string;
    };
  };
};

@Injectable()
export class CarteObservationsService {
  private readonly zToPrecision: Record<number, number> = {
    1: 1 / 10,
    2: 1 / 8,
    3: 1 / 3.5,
    4: 1 / 2,
    5: 1,
    6: 1.8,
    7: 3,
    8: 100,
    9: 100,
    10: 100,
  };

  private readonly parisDateFormatter = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  constructor(private readonly carteMaCacheService: CarteMaCacheService) {}

  /**
   *
   * Vient des fichiers legacy "carte-observations_api.inc.php" et "stations.inc.php"
   *
   * @param query
   * @returns
   */
  async getCarteObservations(
    query: CarteObservationsQuery,
  ): Promise<CarteObservationsResponse> {
    const nowEpochSeconds = Math.floor(Date.now() / 1000);
    const pr = this.getPrecision(query.z);
    const rows = await this.carteMaCacheService.getRowsInBoundingBox({
      south: query.south,
      north: query.north,
      west: query.west,
      east: query.east,
      webcamsOnly: query.webcamsOnly,
      nowEpochSeconds,
    });

    const found: Record<string, number> = {};
    const output: CarteObservationItem[] = [];

    for (const row of rows) {
      const newLat = Math.round(row.latitude * pr) / pr;
      const newLon = Math.round(row.longitude * pr) / pr;
      const key = `${newLat}-${newLon}`;

      if (key in found) {
        continue;
      }

      const payload = this.parsePayload(row.data);
      if (!payload?.type) {
        continue;
      }

      const dist = Math.max(
        0,
        Math.min(Math.floor((nowEpochSeconds - row.time) / 3600), 11),
      );
      const item = this.buildOutputItem({
        payload,
        uid: row.uid,
        latitude: row.latitude,
        longitude: row.longitude,
        time: row.time,
        priorite: row.priorite,
        dist,
        retina: query.retina,
      });

      if (!item) {
        continue;
      }

      found[key] = output.length;
      output.push(item);
    }

    return { DATA: output.reverse() };
  }

  private getPrecision(z: number): number {
    if (z > 10) {
      return 250;
    }
    return this.zToPrecision[z] ?? this.zToPrecision[10];
  }

  private parsePayload(rawData: string): LegacyDataPayload | null {
    try {
      return JSON.parse(rawData) as LegacyDataPayload;
    } catch {
      return null;
    }
  }

  private buildOutputItem({
    payload,
    uid,
    latitude,
    longitude,
    time,
    priorite,
    dist,
    retina,
  }: {
    payload: LegacyDataPayload;
    uid: number;
    latitude: number;
    longitude: number;
    time: number;
    priorite: number;
    dist: number;
    retina: boolean;
  }): CarteObservationItem | null {
    const defaultSize: [number, number] = [26, 26];
    const defaultAnchor: [number, number] = [13, 13];

    if (payload.type === 'ST') {
      return null;
    }

    if (payload.type === 'WC') {
      const icon = `https://www.infoclimat.fr/multimedia/webcams/last/${uid}.jpg.64_64.jpg`;
      return {
        id: `wc:${uid}`,
        lat: Math.round(latitude * 1000) / 1000,
        lon: Math.round(longitude * 1000) / 1000,
        time: this.formatParisDate(time),
        icon,
        size: [50, 50],
        anchor: [25, 25],
        zindex: String(priorite),
        cache: 0,
        type: payload.type,
        stid: null,
      };
    }

    if (payload.type === 'TC') {
      const pheno = payload.pheno === 'pluie' ? 'averse_faible' : payload.pheno;
      if (!pheno) {
        return null;
      }
      const icon = this.getStaticPictoUrl(pheno, dist, retina);
      return {
        id: `tc:${uid}`,
        lat: Math.round(latitude * 1000) / 1000,
        lon: Math.round(longitude * 1000) / 1000,
        time: this.formatParisDate(time),
        icon,
        size: defaultSize,
        anchor: defaultAnchor,
        zindex: String(priorite),
        cache: 1,
        type: payload.type,
        stid: null,
      };
    }

    if (payload.type !== 'MA') {
      return null;
    }

    const pheno = payload.phenos?.[0];
    const value = payload.values?.[0];
    const stid =
      payload.meta?.allmeta?.stid === undefined ||
      payload.meta?.allmeta?.stid === null
        ? null
        : String(payload.meta?.allmeta?.stid);
    if (!pheno) {
      return null;
    }

    let icon: string;
    let size: [number, number] = defaultSize;

    if (!value) {
      icon = this.getStaticPictoUrl(pheno, dist, retina);
    } else if (pheno === 'vent') {
      const direction = payload.meta?.allmeta?.vent_direction;
      const valueNumber = typeof value === 'number' ? Math.round(value) : value;
      if (direction) {
        icon = this.getMaPictoUrl(
          pheno,
          `${valueNumber}.${this.toWindDirectionDegrees(direction)}`,
          dist,
        );
        size = [39, 39];
      } else {
        icon = this.getStaticPictoUrl(pheno, dist, retina);
      }
    } else if (
      pheno === 'tempete' ||
      pheno === 'neige_faible' ||
      pheno === 'neige_moderee' ||
      pheno === 'neige_forte'
    ) {
      icon = this.getMaPictoUrl(pheno, value, dist);
      size = pheno === 'tempete' ? [39, 26] : [39, 39];
    } else {
      icon = this.getMaPictoUrl(pheno, value, dist);
    }

    if (!icon) {
      return null;
    }

    return {
      id: `ma:${uid}`,
      lat: Math.round(latitude * 1000) / 1000,
      lon: Math.round(longitude * 1000) / 1000,
      time: this.formatParisDate(time),
      icon,
      size,
      anchor: defaultAnchor,
      zindex: String(priorite),
      cache: 1,
      type: payload.type,
      stid,
    };
  }

  private getStaticPictoUrl(
    pheno: string,
    dist: number,
    retina: boolean,
  ): string {
    const dimensions = retina ? '52_52' : '26_26';
    return `https://static.infoclimat.net/images/pictos/${dimensions}_g${dist}/${pheno}.png`;
  }

  private getMaPictoUrl(
    pheno: string,
    value: number | string | null,
    dist: number,
  ): string {
    const normalized = this.normalizeMaPhenoAndValue(pheno, value);
    if (normalized.value === null || normalized.value === '') {
      return this.getStaticPictoUrl(normalized.pheno, dist, false);
    }
    return `https://www.infoclimat.fr/cartes/valeurs/__ma${normalized.pheno}/d/${normalized.value}_${dist}.png`;
  }

  private normalizeMaPhenoAndValue(
    pheno: string,
    value: number | string | null,
  ): { pheno: string; value: number | string | null } {
    if (value === null || value === '') {
      return { pheno, value };
    }

    // Legacy mapping: thermal-like phenos are served under __matl
    // and use rounded integer values in icon file names.
    if (pheno === 'temperaturef') {
      const numericValue = Number(value);
      if (Number.isFinite(numericValue)) {
        return {
          pheno: 'tl',
          value: Math.round(numericValue),
        };
      }
      return { pheno: 'tl', value };
    }

    return { pheno, value };
  }

  private toWindDirectionDegrees(direction: string): number {
    switch (direction) {
      case 'Nord-Ouest':
        return 315;
      case 'Nord':
        return 0;
      case 'Sud':
        return 180;
      case 'Nord-Est':
        return 45;
      case 'Est':
        return 90;
      case 'Sud-Ouest':
        return 225;
      case 'Ouest':
        return 270;
      case 'Sud-Est':
        return 135;
      default:
        return 0;
    }
  }

  private formatParisDate(epochSeconds: number): string {
    const date = new Date(epochSeconds * 1000);
    const parts = this.parisDateFormatter.formatToParts(date);

    const getPart = (type: Intl.DateTimeFormatPartTypes): string =>
      parts.find((part) => part.type === type)?.value ?? '';

    const year = getPart('year');
    const month = getPart('month');
    const day = getPart('day');
    const hour = getPart('hour');
    const minute = getPart('minute');
    const second = getPart('second');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }
}
