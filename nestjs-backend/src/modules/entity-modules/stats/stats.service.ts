import { Injectable } from '@nestjs/common';
import { StatsRepository } from './stats.repository';
import { FunctionLogger } from 'src/shared/utils';

@Injectable()
export class StatsService {
  private readonly logger = new FunctionLogger(StatsService.name);
  constructor(private readonly statsRepository: StatsRepository) {}

  async getLiveCounters(): Promise<number> {
    return await this.statsRepository.getNbConnectes();
  }
}
