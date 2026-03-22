import { Module } from '@nestjs/common';
import { CachedStatsService } from './cached-stats.service';
import { CacheManagerModule } from '../redis-cache-manager/redis-cache-manager.module';
import { ConfigModule } from 'src/config/config.module';
import { StatsModule } from 'src/modules/entity-modules/stats/stats.module';
import { CachedStatsController } from './cached-stats.controller';

@Module({
  imports: [CacheManagerModule, ConfigModule, StatsModule],
  providers: [CachedStatsService, CachedStatsController],
  exports: [CachedStatsService, CachedStatsController],
})
export class CachedStatsModule {}
