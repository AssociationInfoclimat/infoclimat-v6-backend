import { Module } from '@nestjs/common';
import { StationsMeteoService } from './stations-meteo.service';
import { StationsMeteoController } from './stations-meteo.controller';
import { StationsMeteoRepository } from './stations-meteo.repository';

@Module({
  imports: [],
  providers: [StationsMeteoService, StationsMeteoRepository],
  exports: [StationsMeteoService],
  controllers: [StationsMeteoController],
})
export class StationsMeteoModule {}
