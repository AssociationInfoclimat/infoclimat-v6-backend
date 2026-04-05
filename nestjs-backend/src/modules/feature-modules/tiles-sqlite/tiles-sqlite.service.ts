import { Injectable } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';
import {
  TilesBoundingBox,
  TilesDatabase,
  TilesDbParams,
  TilesDonneeRow,
} from './tiles-sqlite.types';
import { FunctionLogger } from 'src/shared/utils';

const DAILY_PARAMS = new Set(['temperature_max_24h', 'temperature_min_24h']);

@Injectable()
export class TilesSqliteService {
  private readonly logger = new FunctionLogger(TilesSqliteService.name);
  private readonly basePath: string;

  constructor(private readonly configService: ConfigService) {
    const raw = this.configService.get('TILES_PATH') ?? '';
    this.basePath = path.resolve(raw);
    this.logger.log(`Tiles base path: ${this.basePath}`);
  }

  resolveDatabasePath(params: TilesDbParams): string {
    const monthStr = String(params.month).padStart(2, '0');
    const dayStr = String(params.day).padStart(2, '0');
    const hourStr = String(params.hour).padStart(2, '0');

    const filename = DAILY_PARAMS.has(params.param)
      ? `${dayStr}_00_day.sqlite`
      : `${dayStr}_${hourStr}.sqlite`;

    return path.join(this.basePath, String(params.year), monthStr, filename);
  }

  openDatabase(params: TilesDbParams): TilesDatabase {
    const filePath = this.resolveDatabasePath(params);

    if (!fs.existsSync(filePath)) {
      throw new Error(`Tiles SQLite file not found: ${filePath}`);
    }

    return new Database(filePath, { readonly: true });
  }

  /**
   * Opens the database, queries `donnees`, and closes it.
   * Optionally filters by bounding box.
   */
  queryDonnees(
    params: TilesDbParams,
    bounds?: TilesBoundingBox,
  ): TilesDonneeRow[] {
    const db = this.openDatabase(params);
    try {
      this.logger.debug(
        `Querying database: ${params.param} and ${JSON.stringify(bounds)}`,
      );
      if (bounds) {
        return db
          .prepare(
            `SELECT rowid, latitude, longitude, data FROM donnees
             WHERE latitude >= ? AND latitude <= ?
               AND longitude >= ? AND longitude <= ?`,
          )
          .all(
            bounds.minLat,
            bounds.maxLat,
            bounds.minLon,
            bounds.maxLon,
          ) as TilesDonneeRow[];
      }

      return db
        .prepare('SELECT rowid, latitude, longitude, data FROM donnees')
        .all() as TilesDonneeRow[];
    } finally {
      db.close();
    }
  }

  /**
   * Open a database, run an arbitrary callback, then close.
   */
  withDatabase<T>(params: TilesDbParams, fn: (db: TilesDatabase) => T): T {
    const db = this.openDatabase(params);
    try {
      return fn(db);
    } finally {
      db.close();
    }
  }
}
