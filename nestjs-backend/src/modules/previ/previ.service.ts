import { Injectable } from '@nestjs/common';
import { FunctionLogger } from 'src/shared/utils';
import { IcLegacyApiClientService } from '../ic-legacy-api/ic-legacy-api-client.service';
import { PreviRepository } from './previ.repository';

@Injectable()
export class PreviService {
  private readonly logger = new FunctionLogger(PreviService.name);
  constructor(
    private readonly icLegacyApiClientService: IcLegacyApiClientService,
    private readonly previRepository: PreviRepository,
  ) {}

  async getTicket(body: { lat?: number; lon?: number; accuracy?: number }) {
    return await this.icLegacyApiClientService.getWeatherApiTicket(body);
  }

  async getForecast(body: { data: string; entropy: string }) {
    return await this.icLegacyApiClientService.getWeatherApiForecast(body);
  }

  async getCommonRegionsDepts() {
    const previsionsRegionsDepts =
      await this.previRepository.getCommonRegionsDepts();
    return previsionsRegionsDepts.map((prevision) => {
      return {
        id: prevision.id,
        slug: prevision.slug,
        label: prevision.zone,
        updatedAt: prevision.updatedAt,
        url: `/previsions-regionales-meteo-${prevision.id}-${prevision.slug}.html`,
      };
    });
  }
}
