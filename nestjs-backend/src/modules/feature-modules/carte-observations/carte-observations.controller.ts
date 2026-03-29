import { Controller, Get, Query } from '@nestjs/common';
import { CarteObservationsService } from './carte-observations.service';
import {
  GetCarteObservationsQueryDto,
  GetCarteObservationsResponseDto,
} from './carte-observations.dto';

@Controller('')
export class CarteObservationsController {
  constructor(
    private readonly carteObservationsService: CarteObservationsService,
  ) {}

  @Get('/carte-observations')
  async getCarteObservations(
    @Query() query: GetCarteObservationsQueryDto,
  ): Promise<GetCarteObservationsResponseDto> {
    return GetCarteObservationsResponseDto.toDto(
      await this.carteObservationsService.getCarteObservations({
        west: query.west,
        east: query.east,
        south: query.south,
        north: query.north,
        z: Math.floor(query.z),
        retina: query.retina ?? false,
        webcamsOnly: query.webcams ?? false,
      }),
    );
  }
}
