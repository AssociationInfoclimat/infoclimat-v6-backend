import { Injectable } from '@nestjs/common';
import { previsionnistes } from 'prisma-v5_prevs/v5-prevs-database-client-types';
import { v5PrevsPrismaClient } from 'src/database/v5-prevs-prisma-client';
import { FunctionLogger, slugify } from 'src/shared/utils';
import dayjs from 'dayjs';

@Injectable()
export class PreviRepository {
  private prisma = v5PrevsPrismaClient;

  constructor() {}
  private readonly logger = new FunctionLogger(PreviRepository.name);

  mapping(previsionniste: previsionnistes) {
    return {
      id: previsionniste.id,
      slug: slugify(previsionniste.zone),
      zone: previsionniste.zone,
      updatedAt: dayjs(previsionniste.last_prev).format('YYYY-MM-DD HH:mm:ss'),
    };
  }

  //
  // Was "function get_last_17_previsionnistes(): PDOStatement" in php
  //
  async getCommonRegionsDepts() {
    try {
      const previsionnistes = await this.prisma.previsionnistes.findMany({
        orderBy: { last_prev: 'desc' },
        take: 17,
      });
      return previsionnistes.map(this.mapping);
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
