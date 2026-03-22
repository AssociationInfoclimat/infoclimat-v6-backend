import { Injectable } from '@nestjs/common';
import { FunctionLogger } from 'src/shared/utils';
import { IcLegacyApiClientService } from '../ic-legacy-api/ic-legacy-api-client.service';
import { PreviService } from '../../entity-modules/previ/previ.service';

@Injectable()
export class PreviAggregateService {
  private readonly logger = new FunctionLogger(PreviAggregateService.name);
  constructor(
    private readonly icLegacyApiClientService: IcLegacyApiClientService,
    private readonly previService: PreviService,
  ) {}

  async getTicket(body: { lat?: number; lon?: number; accuracy?: number }) {
    return await this.icLegacyApiClientService.getWeatherApiTicket(body);
  }

  async getForecast(body: { data: string; entropy: string }) {
    return await this.icLegacyApiClientService.getWeatherApiForecast(body);
  }

  async getCommonRegionsDepts() {
    return await this.previService.getCommonRegionsDepts();
  }
}
