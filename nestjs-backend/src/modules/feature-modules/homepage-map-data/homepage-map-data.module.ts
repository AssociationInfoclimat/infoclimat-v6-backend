import { Module } from '@nestjs/common';
import { HomepageMapDataService } from './homepage-map-data.service';
import { StationsMeteoModule } from 'src/modules/entity-modules/stations-meteo/stations-meteo.module';
import { HomepageMapDataController } from './homepage-map-data.controller';

@Module({
  imports: [StationsMeteoModule],
  providers: [HomepageMapDataService, HomepageMapDataController],
  exports: [HomepageMapDataService, HomepageMapDataController],
})
export class HomepageMapDataModule {}
