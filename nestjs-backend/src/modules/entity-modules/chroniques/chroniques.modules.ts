import { Module } from '@nestjs/common';
import { ChroniquesService } from './chroniques.service';
import { ChroniquesRepository } from './chroniques.repository';
import { ChroniquesController } from './chroniques.controller';

@Module({
  imports: [],
  providers: [ChroniquesService, ChroniquesRepository, ChroniquesController],
  exports: [ChroniquesService, ChroniquesController],
})
export class ChroniquesModule {}
