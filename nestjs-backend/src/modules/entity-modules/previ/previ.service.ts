import { Injectable } from '@nestjs/common';
import { FunctionLogger } from 'src/shared/utils';
import { PreviRepository } from './previ.repository';
import { CommonRegionsDepts } from './previ.types';

@Injectable()
export class PreviService {
  private readonly logger = new FunctionLogger(PreviService.name);
  constructor(private readonly previRepository: PreviRepository) {}

  async getCommonRegionsDepts(): Promise<CommonRegionsDepts[]> {
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
