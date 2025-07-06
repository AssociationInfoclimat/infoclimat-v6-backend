import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { StationsMeteoService } from './stations-meteo.service';
import { DonneesCartesTuilesName } from './types';
import { FunctionLogger } from 'src/shared/utils';

@Controller('/stations-meteo')
export class StationsMeteoController {
  private readonly logger = new FunctionLogger(StationsMeteoController.name);
  constructor(private readonly stationsMeteoService: StationsMeteoService) {}

  @Get('/:nom')
  async getTemperatures(
    @Param('nom') name: string,
    @Query('hour') hour: number,
    @Query('year') year: number,
    @Query('day') day: number,
    @Query('month') month: number,
  ) {
    try {
      const data = await this.stationsMeteoService.getStationsData({
        name: name as DonneesCartesTuilesName,
        hour,
        year,
        day,
        month,
      });
      return data;
    } catch (e) {
      this.logger.error(`${e}`);
      throw new BadRequestException('errors.not_found');
    }
  }
}
