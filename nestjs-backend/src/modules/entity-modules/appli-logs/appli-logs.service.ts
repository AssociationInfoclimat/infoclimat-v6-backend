import { Injectable } from '@nestjs/common';
import { AppliLogsRepository } from './appli-logs.repository';
import { AppliLogInsert } from './appli-logs.types';
import { FunctionLogger } from 'src/shared/utils';

@Injectable()
export class AppliLogsService {
  private readonly logger = new FunctionLogger(AppliLogsService.name);
  constructor(private readonly repository: AppliLogsRepository) {}

  async logApiCall(log: AppliLogInsert): Promise<void> {
    await this.repository.insertLog(log);
  }
}
