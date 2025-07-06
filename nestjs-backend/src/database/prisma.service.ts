import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '../config/config.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    super(
      configService.get('DEBUG_QUERIES') === 'true'
        ? {
            log: [
              {
                emit: 'event',
                level: 'query',
              },
            ],
          }
        : undefined,
    );
  }

  async onModuleInit() {
    this.$on('query' as never, async (e) => {
      const t = e as { query: string; params: string };
      this.configService.get('DEBUG_QUERIES') === 'true' &&
        console.log(`${t.query} ${t.params}`);
    });

    await this.$connect();
  }
}
