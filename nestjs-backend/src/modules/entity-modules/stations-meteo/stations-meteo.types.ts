export enum DonneesCartesTuilesName {
  TEMPERATURES = 'temperature',
}

// Repo types:

export type DonneesCartesTuiles = {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
};

export type DonneesCartesTuilesWithNom = {
  nom: string;
} & DonneesCartesTuiles;

// Custom types (service layer):

export type DonneesCartesTuilesWithKey = {
  key: string;
} & DonneesCartesTuilesWithNom;
