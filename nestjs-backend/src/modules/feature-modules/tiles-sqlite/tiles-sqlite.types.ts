import type Database from 'better-sqlite3';

export type TilesDbParams = {
  year: number;
  month: number | string;
  day: number;
  hour: number;
  param: string;
};

export type TilesDonneeRow = {
  rowid: number;
  latitude: number;
  longitude: number;
  data: string;
};

export type TilesBoundingBox = {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
};

export type TilesDatabase = Database.Database;
