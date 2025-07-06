import { Module } from '@nestjs/common';
import { MapdataController } from './mapdata.controller';
import { MapdataService } from './mapdata.service';

@Module({
  imports: [],
  controllers: [MapdataController],
  providers: [MapdataService],
})
export class MapdataModule {}
