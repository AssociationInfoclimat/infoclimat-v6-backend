import { Module } from '@nestjs/common';
import { MetarDataService } from './metar-data.service';
import { PrismaModule } from '../../../database/prisma.module';
import { MetarDataRepository } from './metar-data.repository';

@Module({
  imports: [PrismaModule],
  providers: [MetarDataService, MetarDataRepository],
  exports: [MetarDataService],
})
export class MetarDataModule {}
