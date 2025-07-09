import { Module } from '@nestjs/common';
import { SynopDataService } from './synop-data.service';
import { SynopDataRepository } from './synop-data.repository';

@Module({
  imports: [],
  providers: [SynopDataService, SynopDataRepository],
  exports: [SynopDataService],
})
export class SynopDataModule {}
