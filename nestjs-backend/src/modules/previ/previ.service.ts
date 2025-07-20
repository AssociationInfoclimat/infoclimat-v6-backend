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

  async getCommonRegionsDepts() {
    try {
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
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}
