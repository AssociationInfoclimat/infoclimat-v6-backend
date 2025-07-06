import { Module } from '@nestjs/common';
import { StationsRepository } from './stations.repository';
import { StationsService } from './stations.service';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [StationsService, StationsRepository],
  exports: [StationsService],
})
export class StationsModule {}
