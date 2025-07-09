import { Module } from '@nestjs/common';
import { MetarDataService } from './metar-data.service';
import { MetarDataRepository } from './metar-data.repository';

@Module({
  imports: [],
  providers: [MetarDataService, MetarDataRepository],
  exports: [MetarDataService],
})
export class MetarDataModule {}
