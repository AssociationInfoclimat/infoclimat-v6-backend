import { Module } from '@nestjs/common';
import { DicoRepository } from './dico.repository';
import { DicoService } from './dico.service';

@Module({
  providers: [DicoRepository, DicoService],
  exports: [DicoService],
})
export class DicoModule {}
