import { Injectable } from '@nestjs/common';
import { FunctionLogger } from 'src/shared/utils';
import { IcLegacyApiClientService } from '../ic-legacy-api/ic-legacy-api-client.service';
import { PreviService } from '../../entity-modules/previ/previ.service';
import {
  GetOpenDataApiForecastResponse,
  GetOpenDataApiTicketResponse,
} from '../ic-legacy-api/ic-legacy-api-client.types';
import { CommonRegionsDepts } from 'src/modules/entity-modules/previ/previ.types';

@Injectable()
export class PreviAggregateService {
  private readonly logger = new FunctionLogger(PreviAggregateService.name);
  constructor(
    private readonly icLegacyApiClientService: IcLegacyApiClientService,
    private readonly previService: PreviService,
  ) {}

  async getTicket(body: {
    lat?: number;
    lon?: number;
    accuracy?: number;
  }): Promise<GetOpenDataApiTicketResponse['responseData']> {
    return await this.icLegacyApiClientService.getWeatherApiTicket(body);
  }

  async getForecast(body: {
    data: string;
    entropy: string;
  }): Promise<GetOpenDataApiForecastResponse['reponseData']> {
    return await this.icLegacyApiClientService.getWeatherApiForecast(body);
  }

  async getCommonRegionsDepts(): Promise<CommonRegionsDepts[]> {
    return await this.previService.getCommonRegionsDepts();
  }
}
