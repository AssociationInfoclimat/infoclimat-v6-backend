import { Injectable } from '@nestjs/common';
import { v5DBPrismaClient } from 'src/database/v5-prisma-client';

@Injectable()
export class StatsRepository {
  private prisma = v5DBPrismaClient;

  constructor() {}

  async getNbConnectes(): Promise<number> {
    const stats = await this.prisma.connectes.count();
    return stats;
  }
}
