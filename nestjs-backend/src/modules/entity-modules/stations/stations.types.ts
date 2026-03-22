export enum StationPays {
  FR = 'FR',
  BE = 'BE',
  CH = 'CH',
  CA = 'CA',
  DE = 'DE',
  IT = 'IT',
}

export enum StationGenre {
  METAR = 'metar',
  SYNOP = 'synop',
}

export type Station = {
  id: number;
  label: string;
  kind: StationGenre;
  country: StationPays;
  synopDisabled: boolean;
};
