import { Module } from '@nestjs/common';
import { CarteObservationsService } from './carte-observations.service';
import { CarteObservationsController } from './carte-observations.controller';
import { CarteMaCacheModule } from 'src/modules/entity-modules/carte-ma-cache/carte-ma-cache.module';

@Module({
  imports: [CarteMaCacheModule],
  providers: [CarteObservationsService, CarteObservationsController],
  exports: [CarteObservationsService, CarteObservationsController],
})
export class CarteObservationsModule {}
