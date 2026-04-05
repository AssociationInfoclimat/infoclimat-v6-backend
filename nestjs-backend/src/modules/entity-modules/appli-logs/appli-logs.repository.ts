import { Injectable } from '@nestjs/common';
import { v5DBPrismaClient } from 'src/database/v5-prisma-client';
import { appli_logs_hit } from 'prisma-v5/v5-database-client-types';
import { AppliLogInsert } from './appli-logs.types';

@Injectable()
export class AppliLogsRepository {
  private prisma = v5DBPrismaClient;

  async insertLog(log: AppliLogInsert): Promise<void> {
    await this.prisma.appli_logs.create({
      data: {
        uuid: log.uuid,
        key: log.key,
        function: log.function,
        hit: appli_logs_hit.ONE,
        time: log.time,
        dh: new Date(),
        get: log.get,
        post: '',
      },
    });
  }
}
