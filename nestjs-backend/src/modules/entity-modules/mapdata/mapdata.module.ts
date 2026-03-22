import { Module } from '@nestjs/common';
import { MapdataService } from './mapdata.service';

@Module({
  imports: [],
  providers: [MapdataService],
  exports: [MapdataService],
})
export class MapdataModule {}
