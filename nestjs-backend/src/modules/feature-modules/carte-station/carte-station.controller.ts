import { Controller, Get, Query } from '@nestjs/common';
import { CarteStationService } from './carte-station.service';
import {
  GetCarteStationQueryDto,
  GetCarteStationResponseDto,
} from './carte-station.dto';

@Controller('')
export class CarteStationController {
  constructor(private readonly carteStationService: CarteStationService) {}

  @Get('/carte-station')
  getCarteStation(
    @Query() query: GetCarteStationQueryDto,
  ): GetCarteStationResponseDto {
    return GetCarteStationResponseDto.toDto(
      this.carteStationService.getCarteStation({
        west: query.west,
        east: query.east,
        south: query.south,
        north: query.north,
        year: query.year,
        month: query.month,
        day: query.day,
        hour: query.hour,
        param: query.param,
        z: Math.floor(query.z),
        retina: query.retina ?? false,
        density: query.density ?? 0,
        officialOnly: query['official-only'] ?? false,
        noClustering: query['no-clustering'] ?? 0,
        returnMeta: false,
      }),
    );
  }
}
