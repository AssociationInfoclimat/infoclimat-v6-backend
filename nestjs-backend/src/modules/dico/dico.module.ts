import { Module } from '@nestjs/common';
import { DicoRepository } from './dico.repository';
import { DicoService } from './dico.service';
import { CacheManagerModule } from '../redis-cache-manager/redis-cache-manager.module';
import { ConfigService } from 'src/config/config.service';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [
    // Just to introduce caching system:
    //  See controller example
    CacheManagerModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redisHost: `${configService.get('REDIS_CACHE_HOST')}`,
        redisPort: 6379,
      }),
    }),
  ],
  providers: [DicoRepository, DicoService],
  exports: [DicoService],
})
export class DicoModule {}
