import { Injectable } from '@nestjs/common';
import { lexique, PrismaClient } from 'prisma-dico/dico-database-client-types';
import { FunctionLogger, slugify } from 'src/shared/utils';
import { LexiqueWord } from './dico.types';
import { dicoPrismaClient } from 'src/database/v5-dico-client';

@Injectable()
export class DicoRepository {
  private prisma = dicoPrismaClient;
  private readonly logger = new FunctionLogger(DicoRepository.name);
  constructor() {}

  private mapping(word: lexique): LexiqueWord {
    return {
      id: word.id,
      slug: slugify(word.mot),
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
