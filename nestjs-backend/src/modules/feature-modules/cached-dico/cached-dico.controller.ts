import { BadRequestException, Controller, Get } from '@nestjs/common';
import { FunctionLogger } from 'src/shared/utils';
import { LexiqueWord } from 'src/modules/entity-modules/dico/dico.types';
import { CachedDicoService } from './cached-dico.service';

@Controller('')
export class CachedDicoController {
  private readonly logger = new FunctionLogger(CachedDicoController.name);
  constructor(private readonly cachedDicoService: CachedDicoService) {}

  @Get('/dico/random')
  async getRandomLexique(): Promise<LexiqueWord[]> {
    try {
      return await this.cachedDicoService.getRandomLexique();
    } catch (error) {
      this.logger.error(`${error}`);
      throw new BadRequestException(error);
    }
  }
}
