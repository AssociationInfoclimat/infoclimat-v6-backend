import { Module } from '@nestjs/common';
import { StationsRepository } from './stations.repository';
import { StationsService } from './stations.service';

@Module({
  imports: [],
  providers: [StationsService, StationsRepository],
  exports: [StationsService],
})
export class StationsModule {}
