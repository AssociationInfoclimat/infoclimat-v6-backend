export type DonneesCartesTuilesName =
  | 'colorac60radaric'
  | 'ac3hradaric'
  | 'ac6hradaric'
  | 'ac12hradaric'
  | 'ac24hradaric'
  | 'ac72hradaric'
  | 'radaric'
  | 'temperature'
  | 'pression'
  | 'clouds'
  | 'foudre'
  | 'MCanalysis'
  | 'point_de_rosee'
  | 'temperature_eau'
  | 'temps_omm'
  | 'estofex'
  | 'nexrad'
  | 'goeswi4'
  | 'goeswv1'
  | 'goesei4'
  | 'goesev1'
  | 'goeswv2'
  | 'goesergb'
  | 'goesei7'
  | 'himawarirgb'
  | 'vishdbtrans'
  | 'irAhdbtrans'
  // Was not in the allowed keys but present in the database:
  | 'radarmf';

// Repo types:

export type DonneesCartesTuiles = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
};

export type DonneesCartesTuilesWithNom = {
  nom: DonneesCartesTuilesName;
} & DonneesCartesTuiles;

// Custom types (service layer):

export type DonneesCartesTuilesWithKey = {
  key: string;
} & DonneesCartesTuilesWithNom;
