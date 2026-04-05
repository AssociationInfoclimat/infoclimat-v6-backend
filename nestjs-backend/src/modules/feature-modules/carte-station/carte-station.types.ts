export type CarteStationParam =
  | 'temperature_max'
  | 'temperature_min'
  | 'temperature'
  | 'temps_omm'
  | 'ec_tmm'
  | 'ec_tnm'
  | 'ec_txm';

export type CarteStationQuery = {
  west: number;
  east: number;
  south: number;
  north: number;
  year: number;
  month: string;
  day: number;
  hour: number;
  param: CarteStationParam;
  z: number;
  retina: boolean;
  density: number;
  officialOnly: boolean;
  noClustering: number;
  returnMeta: boolean;
};

export type CarteStationDataItem = {
  id: number;
  lat: number;
  lon: number;
  t: number;
  icon: string;
  size: [number, number];
  anchor: [number, number];
  _uid: string;
  auid: string;
  _ty: string;
  meta: Record<string, unknown> | false;
};

export type CarteStationResponse = {
  elapsed: number;
  data: CarteStationDataItem[];
};

export type LegacyStationData = {
  id_station?: string;
  genre?: string;
  libelle?: string;
  nebulosite?: number | null;
  vent_direction?: number | null;
  raw_msg?: unknown;
  source?: unknown;
  latitude?: unknown;
  longitude?: unknown;
  dh_utc?: unknown;
} & Record<CarteStationParam, unknown>;
