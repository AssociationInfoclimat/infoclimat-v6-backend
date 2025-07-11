import { Injectable } from '@nestjs/common';
import { lexique, PrismaClient } from 'prisma-dico/dico-database-client-types';
import { FunctionLogger } from 'src/shared/utils';
import { LexiqueWord } from './dico.types';
import { dicoPrismaClient } from 'src/database/v5-dico-client';

@Injectable()
export class DicoRepository {
  private prisma = dicoPrismaClient;
  private readonly logger = new FunctionLogger(DicoRepository.name);
  constructor() {}

  // From PHP: get_slug(string $name): string
  private slugify(word: string) {
    if (word.length > 120) {
      word = word.substring(0, 120);
    }

    const accents = [
      'á',
      'à',
      'â',
      'é',
      'è',
      'ê',
      'í',
      'î',
      'ó',
      'ò',
      'ô',
      'œ',
      'ú',
      'ù',
      'û',
      'ü',
      '¨',
      'ñ',
      'ç',
      ' ',
      '&',
      '°',
      '\\.',
      ',',
      ';',
      '\\!',
      '\\?',
      ' - ',
      '_',
      '  ',
      '\\.\\.\\.',
      '\\^',
      '\\(',
      '\\)',
    ];
    const replace = [
      'a',
      'a',
      'a',
      'e',
      'e',
      'e',
      'i',
      'i',
      'o',
      'o',
      'o',
      'oe',
      'u',
      'u',
      'u',
      'u',
      'u',
      'n',
      'c',
      '',
      '',
      'degres',
      '',
      '-',
      '',
      '',
      '',
      '-',
      '',
      '-',
      '',
      '',
      '',
      '',
    ];

    // Convert HTML entities to their corresponding characters
    let normalizedWord = word.trim();

    // Replace accents and special characters
    for (let i = 0; i < accents.length; i++) {
      normalizedWord = normalizedWord.replace(
        new RegExp(accents[i], 'g'),
        replace[i],
      );
    }

    // Replace any non-alphanumeric characters with hyphens
    normalizedWord = normalizedWord.replace(/[^a-zA-Z0-9-]/g, '-');

    // Convert to lowercase
    normalizedWord = normalizedWord.toLowerCase();

    // Replace multiple consecutive hyphens with a single hyphen
    return normalizedWord.replace(/-+/g, '-');
  }

  private mapping(word: lexique): LexiqueWord {
    return {
      id: word.id,
      slug: this.slugify(word.mot),
      mot: word.mot.charAt(0).toUpperCase() + word.mot.slice(1), // ucfirst
    };
  }

  async getTenRandomLexique() {
    try {
      return (
        await this.prisma.lexique.findMany({
          where: { valide: 1 },
          orderBy: { id: 'asc' },
          take: 10,
        })
      ).map((word) => this.mapping(word));
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
