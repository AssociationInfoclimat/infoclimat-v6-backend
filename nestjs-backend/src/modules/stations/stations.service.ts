import { Injectable } from '@nestjs/common';
import { StationsRepository } from './stations.repository';
import { Station } from './stations.types';
import { FunctionLogger } from 'src/shared/utils';

@Injectable()
export class StationsService {
  private readonly logger = new FunctionLogger(StationsService.name);
  constructor(private readonly repository: StationsRepository) {}

  async getCommonStations(): Promise<Station[]> {
    try {
      return await this.repository.getCommonStations();
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
