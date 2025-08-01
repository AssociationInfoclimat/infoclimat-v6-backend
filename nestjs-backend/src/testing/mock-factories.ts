/**
 * Mock factories for database entities and service responses
 * Used to create consistent test data across unit tests
 */

import {
  DonneesCartesTuiles,
  DonneesCartesTuilesName,
} from '../modules/stations-meteo/types';
import { LexiqueWord } from '../modules/dico/dico.types';

export class MockFactories {
  /**
   * Creates a mock DonneesCartesTuiles object
   */
  static createMockDonneesCartesTuiles(
    overrides?: Partial<DonneesCartesTuiles>,
  ): DonneesCartesTuiles {
    return {
      year: '2024',
      month: '04',
      day: '16',
      hour: '20',
      minute: '00',
      ...overrides,
    };
  }

  /**
   * Creates a mock cartes_tuiles database record
   */
  static createMockCartesTuilesRecord(overrides?: {
    nom?: string;
    donnees?: DonneesCartesTuiles;
  }) {
    const donnees =
      overrides?.donnees || MockFactories.createMockDonneesCartesTuiles();
    return {
      id: 1,
      nom: overrides?.nom || DonneesCartesTuilesName.TEMPERATURES,
      donnees: JSON.stringify(donnees),
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  /**
   * Creates a mock lexique database record
   */
  static createMockLexiqueRecord(overrides?: {
    id?: number;
    mot?: string;
    valide?: number;
  }) {
    return {
      id: overrides?.id || 1,
      mot: overrides?.mot || 'temperature',
      valide: overrides?.valide || 1,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  /**
   * Creates a mock LexiqueWord response
   */
  static createMockLexiqueWord(overrides?: Partial<LexiqueWord>): LexiqueWord {
    return {
      id: 1,
      slug: 'temperature',
      mot: 'Temperature',
      ...overrides,
    };
  }

  /**
   * Creates multiple mock lexique records
   */
  static createMockLexiqueRecords(count: number = 10) {
    const words = [
      'température',
      'pluie',
      'vent',
      'nuage',
      'soleil',
      'orage',
      'neige',
      'brouillard',
      'humidité',
      'pression',
    ];

    return Array.from({ length: count }, (_, index) =>
      MockFactories.createMockLexiqueRecord({
        id: index + 1,
        mot: words[index] || `mot${index + 1}`,
      }),
    );
  }

  /**
   * Creates multiple mock LexiqueWord responses
   */
  static createMockLexiqueWords(count: number = 10): LexiqueWord[] {
    const words = [
      { mot: 'Température', slug: 'temperature' },
      { mot: 'Pluie', slug: 'pluie' },
      { mot: 'Vent', slug: 'vent' },
      { mot: 'Nuage', slug: 'nuage' },
      { mot: 'Soleil', slug: 'soleil' },
      { mot: 'Orage', slug: 'orage' },
      { mot: 'Neige', slug: 'neige' },
      { mot: 'Brouillard', slug: 'brouillard' },
      { mot: 'Humidité', slug: 'humidite' },
      { mot: 'Pression', slug: 'pression' },
    ];

    return Array.from({ length: count }, (_, index) => ({
      id: index + 1,
      mot: words[index]?.mot || `Mot${index + 1}`,
      slug: words[index]?.slug || `mot${index + 1}`,
    }));
  }
}
