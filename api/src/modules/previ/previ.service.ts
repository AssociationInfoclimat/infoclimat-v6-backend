import { Injectable } from '@nestjs/common';
import { FunctionLogger } from 'src/shared/utils';
import { IcLegacyApiClientService } from '../ic-legacy-api/ic-legacy-api-client.service';

@Injectable()
export class PreviService {
  private readonly logger = new FunctionLogger(PreviService.name);
  constructor(
    private readonly icLegacyApiClientService: IcLegacyApiClientService,
  ) {}

  async getTicket(body: { lat?: number; lon?: number; accuracy?: number }) {
    try {
      return await this.icLegacyApiClientService.getWeatherApiTicket(body);
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }

  async getForecast(body: { data: string; entropy: string }) {
    try {
      return await this.icLegacyApiClientService.getWeatherApiForecast(body);
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
