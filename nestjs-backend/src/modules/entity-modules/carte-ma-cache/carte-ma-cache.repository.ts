import { Injectable } from '@nestjs/common';
import { v5DBPrismaClient } from 'src/database/v5-prisma-client';
import { Prisma } from 'prisma-v5/v5-database-client-types';
import { CarteMaCacheQuery, CarteMaCacheRow } from './carte-ma-cache.types';

@Injectable()
export class CarteMaCacheRepository {
  private prisma = v5DBPrismaClient;

  async findInBoundingBox({
    south,
    north,
    west,
    east,
    webcamsOnly,
    nowEpochSeconds,
  }: CarteMaCacheQuery): Promise<CarteMaCacheRow[]> {
    const priorityClause = webcamsOnly
      ? Prisma.sql`AND priorite = 1`
      : Prisma.sql`AND priorite > 1`;

    return await this.prisma.$queryRaw<CarteMaCacheRow[]>`
      SELECT \`time\`, priorite, uid, latitude, longitude, data
      FROM V5.carte_MA_cache
      WHERE latitude >= ${south}
        AND latitude <= ${north}
        AND longitude >= ${west}
        AND longitude <= ${east}
        ${priorityClause}
      ORDER BY priorite / (ABS(${nowEpochSeconds} - \`time\`) + 0.1) DESC
    `;
  }
}
