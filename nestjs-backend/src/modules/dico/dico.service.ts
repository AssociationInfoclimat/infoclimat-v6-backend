import { BadRequestException, Injectable } from '@nestjs/common';
import { DicoRepository } from './dico.repository';
import { FunctionLogger } from 'src/shared/utils';

@Injectable()
export class DicoService {
  private readonly logger = new FunctionLogger(DicoService.name);
  constructor(private readonly dicoRepository: DicoRepository) {}

  async getTenRandomLexique() {
    try {
      // TODO: handle cache
      return this.dicoRepository.getTenRandomLexique();
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
