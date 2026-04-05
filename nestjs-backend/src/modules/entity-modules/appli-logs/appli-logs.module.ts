import { Module } from '@nestjs/common';
import { AppliLogsService } from './appli-logs.service';
import { AppliLogsRepository } from './appli-logs.repository';

@Module({
  providers: [AppliLogsService, AppliLogsRepository],
  exports: [AppliLogsService],
})
export class AppliLogsModule {}
