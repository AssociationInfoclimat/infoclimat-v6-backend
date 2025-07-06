import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { StationsMeteoService } from './stations-meteo.service';
import { StationsMeteoController } from './stations-meteo.controller';
import { StationsMeteoRepository } from './stations-meteo.repository';
import { TilesExplorerModule } from '../tiles-explorer/tiles-explorer.module';

@Module({
  imports: [PrismaModule, TilesExplorerModule],
  providers: [StationsMeteoService, StationsMeteoRepository],
  exports: [StationsMeteoService],
  controllers: [StationsMeteoController],
})
export class StationsMeteoModule {}
