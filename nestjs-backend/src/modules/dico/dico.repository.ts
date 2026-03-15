import { Injectable } from '@nestjs/common';
import { FunctionLogger } from 'src/shared/utils';
import { LexiqueWord, mappingLexiqueWord } from './dico.types';
import { dicoPrismaClient } from 'src/database/dico-prisma-client';

@Injectable()
export class DicoRepository {
  private prisma = dicoPrismaClient;
  private readonly logger = new FunctionLogger(DicoRepository.name);
  constructor() {}

  async getTenRandomLexique(): Promise<LexiqueWord[]> {
    return (
      await this.prisma.lexique.findMany({
        where: { valide: 1 },
        orderBy: { id: 'asc' },
        take: 10,
      })
    ).map((word) => mappingLexiqueWord(word));
  }
}
