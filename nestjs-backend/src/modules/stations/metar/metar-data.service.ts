import { Injectable } from '@nestjs/common';
import { MetarDataRepository } from './metar-data.repository';
import { FunctionLogger } from 'src/shared/utils';

@Injectable()
export class MetarDataService {
  private readonly logger = new FunctionLogger(MetarDataService.name);
  constructor(private readonly metarDataRepository: MetarDataRepository) {}

  async getMetarData({
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
      return this.metarDataRepository.getMetarData({
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
