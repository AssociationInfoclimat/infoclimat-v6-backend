import { LexiqueWord } from 'src/modules/entity-modules/dico/dico.types';
import { RedisCacheManagerService } from '../redis-cache-manager/redis-cache-manager.service';
import { FunctionLogger } from 'src/shared/utils';
import { DicoService } from 'src/modules/entity-modules/dico/dico.service';
import { Injectable } from 'node_modules/@nestjs/common';

@Injectable()
export class CachedDicoService {
  private readonly logger = new FunctionLogger(CachedDicoService.name);
  constructor(
    private readonly dicoService: DicoService,
    private readonly redisCacheManagerService: RedisCacheManagerService,
  ) {}

  async getRandomLexique(): Promise<LexiqueWord[]> {
    // Just to test the cache:
    const cachedData =
      await this.redisCacheManagerService.getItem<LexiqueWord[]>('dico:random');
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
  }
}
