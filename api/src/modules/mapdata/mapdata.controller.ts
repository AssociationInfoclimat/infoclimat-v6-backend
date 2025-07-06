import { Controller, Get } from '@nestjs/common';
import { MapdataService } from './mapdata.service';

@Controller()
export class MapdataController {
  constructor(private readonly mapdataService: MapdataService) {}

  @Get()
  getExample() {
    return this.mapdataService.getTemperatures();
  }
}
