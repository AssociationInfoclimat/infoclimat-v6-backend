import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsRepository } from './stats.repository';

@Module({
  imports: [],
  providers: [StatsService, StatsRepository],
  exports: [StatsService],
})
export class StatsModule {}
