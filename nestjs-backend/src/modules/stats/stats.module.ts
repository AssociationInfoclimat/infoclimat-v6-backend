import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsRepository } from './stats.repository';
import { CacheManagerModule } from '../redis-cache-manager/redis-cache-manager.module';
import { ConfigModule } from 'src/config/config.module';

@Module({
  imports: [CacheManagerModule, ConfigModule],
  providers: [StatsService, StatsRepository],
  exports: [StatsService],
})
export class StatsModule {}
