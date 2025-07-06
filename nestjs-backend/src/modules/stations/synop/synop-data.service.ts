import { Injectable } from '@nestjs/common';
import { SynopDataRepository } from './synop-data.repository';
import { FunctionLogger } from 'src/shared/utils';

@Injectable()
export class SynopDataService {
  private readonly logger = new FunctionLogger(SynopDataService.name);
  constructor(private readonly synopDataRepository: SynopDataRepository) {}

  async getSynopData({
    stationId,
    yyyy,
    mm,
    dd,
    now,
  }: {
    stationId: number;
    yyyy: number;
    mm: number;
    dd: number;
    now?: string; // datetime  as a `DATE_SUB` argument
  }) {
    try {
      return this.synopDataRepository.getSynopData({
        stationId,
        yyyy,
        mm,
        dd,
        now,
      });
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
