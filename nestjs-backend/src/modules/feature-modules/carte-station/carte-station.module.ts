import { Module } from '@nestjs/common';
import { CarteStationService } from './carte-station.service';
import { CarteStationController } from './carte-station.controller';
import { TilesSqliteModule } from 'src/modules/feature-modules/tiles-sqlite/tiles-sqlite.module';

@Module({
  imports: [TilesSqliteModule],
  providers: [CarteStationService, CarteStationController],
  exports: [CarteStationService, CarteStationController],
})
export class CarteStationModule {}
