import { BadRequestException, Controller, Get } from '@nestjs/common';
import { DicoService } from './dico.service';
import { FunctionLogger } from 'src/shared/utils';
import { RedisCacheManagerService } from '../redis-cache-manager/redis-cache-manager.service';
import { LexiqueWord } from './dico.types';

@Controller('dico')
export class DicoController {
  private readonly logger = new FunctionLogger(DicoController.name);
  constructor(
    private readonly dicoService: DicoService,
    private readonly redisCacheManagerService: RedisCacheManagerService,
  ) {}

  @Get('random')
  async getRandomLexique(): Promise<LexiqueWord[]> {
    try {
      // Just to test the cache:
      const cachedData =
        await this.redisCacheManagerService.getItem<LexiqueWord[]>(
          'dico:random',
        );
      if (cachedData) {
        return cachedData;
      }
      // End cache testing

      const response = await this.dicoService.getTenRandomLexique();

      // Just test the cache:
      await this.redisCacheManagerService.setItem(
        'dico:random',
        response,
        60 * 60 * 24,
      );
      return response;
    } catch (error) {
      this.logger.error(`${error}`);
      throw new BadRequestException(error);
    }
  }
}
