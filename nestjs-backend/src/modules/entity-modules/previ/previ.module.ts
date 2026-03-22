import { Module } from '@nestjs/common';
import { PreviService } from './previ.service';
import { PreviRepository } from './previ.repository';

@Module({
  imports: [],
  providers: [PreviService, PreviRepository],
  exports: [PreviService],
})
export class PreviModule {}
