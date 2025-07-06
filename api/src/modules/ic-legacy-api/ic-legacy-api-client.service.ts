import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import {
  GetOpenDataApiForecastResponse,
  GetOpenDataApiTicketResponse,
} from './ic-legacy-api-client.types';
import { FunctionLogger } from 'src/shared/utils';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class IcLegacyApiClientService {
  private readonly logger = new FunctionLogger(IcLegacyApiClientService.name);
  constructor(private readonly icHttpService: HttpService) {}

  async getWeatherApiTicket({
    lat,
    lon,
    accuracy,
  }: {
    lat?: number;
    lon?: number;
    accuracy?: number;
  }) {
    try {
      // They can be "undefined" (literally, in the endpoint string):
      const response = await firstValueFrom(
        this.icHttpService.get<GetOpenDataApiTicketResponse>(
          `/previ/${lat};${lon};${accuracy}/ticket`,
          {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }

  async getWeatherApiForecast({
    data,
    entropy,
  }: {
    data: string;
    entropy: string;
  }) {
    try {
      const response = await firstValueFrom(
        this.icHttpService.get<GetOpenDataApiForecastResponse>(
          `/previ/${data}/get?u=${entropy}`,
          {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
