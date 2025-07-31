import { Types } from './chroniques.types';

export const MAPPING_NUM_TO_TYPE: Record<number, Types> = {
  14: Types.Froid,
  1: Types.Froid,
  12: Types.Gel,
  13: Types.Gel,
  2: Types.Neige,
  16: Types.Neige,
  17: Types.Neige,
  11: Types.Verglas,
  4: Types.Pluie,
  5: Types.Inondation,
  6: Types.Tempete,
  19: Types.Vent,
  20: Types.Vent,
  7: Types.Vent,
  8: Types.Chaleur,
  3: Types.Douceur,
  9: Types.Orages,
  10: Types.Secheresse,
};
