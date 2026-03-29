export type CarteObservationsQuery = {
  south: number;
  north: number;
  west: number;
  east: number;
  z: number;
  retina: boolean;
  webcamsOnly: boolean;
};

export type CarteObservationItem = {
  id: string;
  lat: number;
  lon: number;
  time: string;
  icon: string;
  size: [number, number];
  anchor: [number, number];
  zindex: string;
  cache: number;
  type: string;
  stid: string | null;
};

export type CarteObservationsResponse = {
  DATA: CarteObservationItem[];
};
