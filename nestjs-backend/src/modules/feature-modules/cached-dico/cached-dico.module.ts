import { Module } from '@nestjs/common';
import { CacheManagerModule } from '../redis-cache-manager/redis-cache-manager.module';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { CachedDicoController } from './cached-dico.controller';
import { DicoModule } from 'src/modules/entity-modules/dico/dico.module';
import { CachedDicoService } from './cached-dico.service';

@Module({
  imports: [
    CacheManagerModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redisHost: `${configService.get('REDIS_CACHE_HOST')}`,
        redisPort: 6379,
      }),
    }),
    DicoModule,
  ],
  providers: [CachedDicoService, CachedDicoController],
  exports: [CachedDicoService, CachedDicoController],
})
export class CachedDicoModule {}
