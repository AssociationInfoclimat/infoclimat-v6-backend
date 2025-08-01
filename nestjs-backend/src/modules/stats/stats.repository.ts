import { Injectable } from '@nestjs/common';
import { v5DBPrismaClient } from 'src/database/v5-prisma-client';

@Injectable()
export class StatsRepository {
  private prisma = v5DBPrismaClient;

  constructor() {}

  async getNbConnectes() {
    try {
      const stats = await this.prisma.connectes.count();
      return stats;
    } catch (error) {
      throw new Error(`Error getting stats: ${error}`);
    }
  }
}
