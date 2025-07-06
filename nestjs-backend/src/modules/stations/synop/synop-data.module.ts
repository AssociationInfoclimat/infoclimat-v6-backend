import { Module } from '@nestjs/common';
import { SynopDataService } from './synop-data.service';
import { PrismaModule } from '../../../database/prisma.module';
import { SynopDataRepository } from './synop-data.repository';

@Module({
  imports: [PrismaModule],
  providers: [SynopDataService, SynopDataRepository],
  exports: [SynopDataService],
})
export class SynopDataModule {}
