import { Injectable } from '@nestjs/common';
import { DicoRepository } from './dico.repository';
import { FunctionLogger } from 'src/shared/utils';
import { LexiqueWord } from './dico.types';

@Injectable()
export class DicoService {
  private readonly logger = new FunctionLogger(DicoService.name);
  constructor(private readonly dicoRepository: DicoRepository) {}

  async getTenRandomLexique(): Promise<LexiqueWord[]> {
    // TODO: handle cache
    return this.dicoRepository.getTenRandomLexique();
  }
}
