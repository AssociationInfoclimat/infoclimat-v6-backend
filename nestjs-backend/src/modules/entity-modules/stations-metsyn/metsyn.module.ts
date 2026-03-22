import { Module } from '@nestjs/common';
import { MetsynRepository } from './metsyn.repository';
import { MetsynService } from './metsyn.service';

@Module({
  providers: [MetsynRepository, MetsynService],
  exports: [MetsynService],
})
export class MetsynModule {}
