import { Module } from '@nestjs/common';
import { ChroniquesService } from './chroniques.service';
import { ChroniquesRepository } from './chroniques.repository';

@Module({
  imports: [],
  providers: [ChroniquesService, ChroniquesRepository],
  exports: [ChroniquesService],
})
export class ChroniquesModule {}
