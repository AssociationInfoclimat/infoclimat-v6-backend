import { Injectable } from '@nestjs/common';
import { MetsynRepository } from './metsyn.repository';
import { FunctionLogger } from 'src/shared/utils';

@Injectable()
export class MetsynService {
  private readonly logger = new FunctionLogger(MetsynService.name);
  constructor(private readonly metsynRepository: MetsynRepository) {}

  async getMetsynTextId(stationId: number): Promise<string> {
    try {
      return this.metsynRepository.getMetsynTextId(stationId);
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
