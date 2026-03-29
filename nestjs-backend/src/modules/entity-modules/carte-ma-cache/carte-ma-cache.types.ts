export type CarteMaCacheRow = {
  time: number;
  priorite: number;
  uid: number;
  latitude: number;
  longitude: number;
  data: string;
};

export type CarteMaCacheQuery = {
  south: number;
  north: number;
  west: number;
  east: number;
  webcamsOnly: boolean;
  nowEpochSeconds: number;
};
